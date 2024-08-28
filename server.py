import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import traceback
import os
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from gql.transport.websockets import WebsocketsTransport
import asyncio
from datetime import datetime, timezone

# 현재 시간을 UTC 기준으로 가져오기
now = datetime.now(timezone.utc)
# 형식에 맞게 시간 포맷팅
formatted_time = now.isoformat()

# Hasura GraphQL 엔드포인트
server_url = '3.27.63.83:8080/v1/graphql'

# 요청 전송 설정
mutationTransport = RequestsHTTPTransport(
    url=f"http://{server_url}",
    use_json=True,
)

# WebSocket을 통한 요청 전송 설정
subscriptionTransport = WebsocketsTransport(
    url=f"ws://{server_url}",
)

# GraphQL queries
mutation = gql("""
mutation MyMutation2($mid:Int) {
  update_Chat_log(where: {message_id: {_eq: $mid}}, _inc: {}, _set: {is_filtered: true}) {
    returning {
      message_id
      is_filtered
      content
    }
  }
}
""")

subscription = gql("""
subscription MySubscription($started: timestamptz) {
  Chat_log_stream(batch_size: 10, cursor: {initial_value: {sent_at: $started}}, where: {}) {
    content
    message_id
  }
}
""")

# Mutation에 필요한 변수
mutationParams = {}

# Subscription에 필요한 변수
subscriptionParams = {
    "started": formatted_time
}

# 클라이언트 설정
mutationClient = Client(transport=mutationTransport, fetch_schema_from_transport=True)
subscriptionClient = Client(transport=subscriptionTransport, fetch_schema_from_transport=True)

# 모델과 토크나이저 로드
def load_model_and_tokenizer():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'checkpoint', 'saved_model.keras')
    tokenizer_path = os.path.join(current_dir, 'checkpoint', 'tokenizer.pickle')

    try:
        model = tf.keras.models.load_model(model_path)
        with open(tokenizer_path, 'rb') as handle:
            tokenizer = pickle.load(handle)
        print(model.summary())
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model or tokenizer: {e}")
        traceback.print_exc()
        return None, None

def preprocess_text(text, tokenizer):
    sequences = tokenizer.texts_to_sequences([text])
    print(f"Tokenized sequence: {sequences}")
    padded_sequences = pad_sequences(sequences, maxlen=100)
    print(f"Padded sequence: {padded_sequences}")
    return padded_sequences

# Subscription 처리
async def subscribe_chat(model, tokenizer):
    async with subscriptionClient as session:
        async for result in session.subscribe(subscription, variable_values=subscriptionParams):
            print(f"subscribe result: {result}")
            for log in result['Chat_log_stream']:
                processed_text = preprocess_text(log['content'], tokenizer)
                predictions = model.predict(processed_text)
                print(f"Raw predictions: {predictions}")
                is_profanity = bool(predictions[0][0] > 0.5)  # 0.5를 임계값으로 사용
                
                print(f"Input text: {processed_text}")
                print(f"Prediction value: {predictions[0][0]}")
                print(f"Is profanity: {is_profanity}")
                
                if is_profanity:
                    mutationParams["mid"] = log["message_id"]
                    response = mutationClient.execute(mutation, variable_values=mutationParams)
                    print(response)

# CORS 헤더 추가 함수
def add_cors_headers(headers):
    #CORS 헤더를 추가하는 함수
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    if isinstance(headers, dict):
        headers.update(cors_headers)
    elif isinstance(headers, list):
        headers.extend([(k, v) for k, v in cors_headers.items()])
    else:
        raise ValueError("Headers must be either a dict or a list")
    
    return headers

def main():
    model, tokenizer = load_model_and_tokenizer()
    if model is None or tokenizer is None:
        print("Failed to load model or tokenizer. Exiting.")
        return
    
    # 비동기 작업 실행
    asyncio.run(subscribe_chat(model, tokenizer))

if __name__ == '__main__':
    main()