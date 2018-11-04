/**
 * Created by zerowolf on 2017/11/2.
 */
import {SERVICE_BASE} from '../def/conf';
import qs from 'qs'
import {get_local_token, set_local_token} from '../store/storage';


const http_factory = (method) => {
    return async (url, params) => {
        url = url_mapper(url);
        //获取togen
        let token = await get_local_token();

        //生成fetch请求选项
        const RequestOptions = {
            method,
            header: {
                Accept: 'application/json',
                token
            },
        };

        if (method == "GET") {
            const queryString = qs.stringify(params);
            url = `${url}${queryString && "?" + queryString}`
        } else {
            RequestOptions.header = {...RequestOptions.header, 'Content_Type': 'application/json'};
            RequestOptions.body = JSON.stringify(params);
        }


        /**
         * 发送http请求
         * @returns {*}
         */
        const send_request = () => {
            const _fetchCache = {
                url,
                RequestOptions
            };

            return new Promise((resolve, reject) => {
                fetch(url, RequestOptions)
                    .then(response => {
                        resolve(response);
                    }).catch(e => {
                    store.dispatch({
                        type: "NETWORK_ERROR",
                        cache: {
                            url,
                            RequestOptions,
                            resolve
                        }
                    });
                })
            });
        };

        try {
            console.log("@http_factory before sending")
            const http_result = await send_request()
            console.log("@http_factory send request to " + url + " with params ")
            console.log(params)
            console.log("and options")
            console.log(requestOptions)
            const text = await http_result.text()
            const json = JSON.parse(text)

            console.log("get json result with token:" + json.token)
            console.log(json)
            if (json.token) {
                set_local_token(json.token)
            }
            // return {type : "HTTP_RESULT", url : "url",  json}
            return json
        }catch (e){
            console.error(e + ":" + url)
        }
    }


}

/**
 * URL 计算请求函数
 * @param url
 */
export const url_mapper = (url) => {
    const fullUrl = SERVICE_BASE.replace(/\/$/, '') + "/" + url.replace(/^\//, '')
    console.log("@at url_maper :" + fullUrl)
    return fullUrl
}