import axios from 'axios';
import { restAPI, restHeaders } from "appdir/app";


const fetchHello = () => {
    let hdr = restHeaders();
    return axios.get(`${restAPI}/hello`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetchHello,
}
