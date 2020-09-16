import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from "../_actions/user_actions"

export default function (SpecificComponent, option, adminRoute = null) {

    /*
        * option  (null / true / false)
        null : 아무나 출입이 가능한 페이지
        true : 로그인한 유저만 출입 가능
        false : 로그인한 유저는 출입 불가
    
        * adminRoute
        true : admin만 출입 가능

    */

    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch()

        useEffect(() => {    

            dispatch(auth())
                .then(response => {
                    console.log(response)

                    // 로그인 하지 않은 상태
                    if(!response.payload.isAuth) {
                        if (option) {   // true : 로그인한 유저만 출입 가능한 페이지
                            props.history.push('/login')
                        }
                    } else {
                        // 로그인 한 상태
                        if (adminRoute && !response.payload.isAdmin) {
                            // admin이 아닌데 admin이 들어갈 수 있는 사이트를 들어가려 할 때
                            props.history.push('/')
                        } else {
                            if (!option) {  // false : 로그인한 유저는 출입 불가한 페이지
                                props.history.push('/')
                            }
                        }
                    }
                })       
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}