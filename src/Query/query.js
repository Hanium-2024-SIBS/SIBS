import {gql} from '@apollo/client';

const INSERT_USER_INFO = gql`
mutation insertUser($user: User_insert_input!){
    insert_User_one(object: $user){
        email,
        provider,
        clientId,
        password,
        birthday,
        name
    }
}
`

const GET_ONE_USER = gql`
query getUserOne($user: User_bool_exp){
  User(where: $user){
    user_id,
    clientId,
    email,
    password,
    provider,
    birthday,
    name
  }
}
`;

export {INSERT_USER_INFO, GET_ONE_USER};