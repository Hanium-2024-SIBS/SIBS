import {gql} from '@apollo/client';

const INSERT_USER_INFO = gql`
mutation insertUser($user: User_insert_input!){
    insert_User_one(object: $user){
        email,
        provider,
        clientId,
        password,
        birthday
    }
}
`

export {INSERT_USER_INFO};