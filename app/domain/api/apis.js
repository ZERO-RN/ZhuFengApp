/**
 * Created by zerowolf on 2017/11/2.
 */
import {http_get, http_post, http_put, url_mapper} from './apis';
import RNFetchBlob from 'react-native-fetch-blob';
import {get_local_token} from "../store/storage";

export const get_token = async(force)=>{
    if (!force&&store.getState.user.token){

    }
}