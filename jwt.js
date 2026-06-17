


import axios from 'axios';
import toastr from 'toastr';
var CryptoJS = require("crypto-js");

export default {
  myToken() {

    let my_date = new Date();
    let my_minus = my_date.getMinutes();

    localStorage.setItem("jwt", this.GeneralToken());
    localStorage.setItem("my_minus", my_minus);
    var t = 0;
    var MyToken = setInterval(function () {

      let my_date = new Date();
      let my_minus = my_date.getMinutes();
      let my_minus_old = localStorage.getItem("my_minus");






      if (my_minus != my_minus_old) {
        localStorage.setItem("my_minus", my_minus);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + localStorage.getItem("jwt");
        if (false) { //t>36){




          toastr.error("Token hết hạn. Bạn không thể dùng các chức năng của website.");
          jQuery("body").prepend("<div style='position: fixed;height: 42px;top: 0px; z-index: 999999;' class='col-12 text-center p-1 bg-danger danger-reload-page'><a class='btn btn-sm btn-info' href='' >Reload</a> <span style='color:white'>Hết hạn token. Vui lòng reload lại trang.</span> </div>");

          clearInterval(MyToken);
        } else {
          t = t + 1;
          axios.get("/restful/checklogin?get_token=1").then(res => {
            if (res.status === 200) {

              localStorage.setItem("jwt", res.data.token);

              axios.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage.getItem("jwt");

              toastr.info(res.data.token);
            }
            if (res.data.status === 0) {

              toastr.error("Token hết hạn. Bạn không thể dùng các chức năng của website.");
              jQuery("body").prepend("<div style='position: fixed;height: 42px;top: 0px; z-index: 999999;' class='col-12 text-center p-1 bg-danger danger-reload-page'><a class='btn btn-sm btn-info' href='' >Reload</a> <span style='color:white'>Hết hạn token. Vui lòng reload lại trang.</span> </div>");

              clearInterval(MyToken);
            }

          });
        }


      }

    }, 600000);
  },
  GeneralToken() {

    var jwtSecret = "bOxatm7Vk76lzFqv4Q4oR1ew";
    var jwtSsl = "ticket.com";
    var userName = "ticket";
    // Set headers for JWT
    var header = {
      'typ': 'JWT',
      'alg': 'HS256'
    };

    // Prepare timestamp in seconds
    var currentTimestamp = Math.floor(Date.now() / 1000)

    var data = {
      'iss': jwtSsl,
      'userName': userName,
      'iat': currentTimestamp,
      'exp': currentTimestamp + 6 * 10, // expiry time is 6 mininus from time of creation
      'nbf': currentTimestamp
    }



    // encode header
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    var encodedHeader = this.base64url(stringifiedHeader)

    // encode data
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
    var encodedData = this.base64url(stringifiedData)

    // build token
    var token = `${encodedHeader}.${encodedData}`

    // sign token
    var signature = CryptoJS.HmacSHA256(token, jwtSecret)
    signature = this.base64url(signature);
    console.log("token", token);
    console.log("signature", signature);
    return `${token}.${signature}`

  },
  base64url(source) {
    // Encode in classical base64
    var encodedSource = CryptoJS.enc.Base64.stringify(source)

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '')

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-')
    encodedSource = encodedSource.replace(/\//g, '_')

    return encodedSource
  }

}
