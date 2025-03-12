"use strict";
const fs = require("fs");
const path = require("path");
const http = require("http");
const port = process.env.LEANCLOUD_APP_PORT;
var httpServer = http.createServer(processRequest);
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml"
  };
  return mimeTypes[extname] || "application/octet-stream";
}

function processRequest(req, response) {
  if (req.url.indexOf("/post") !== -1) {
    response.writeHead(200, { "content-type": "application/json" });
    let url = req.url;
    let params = url.substr(url.indexOf("?") + 1);
    let paramsArr = params.split("&");
    let paramsObj = {};
    paramsArr.forEach(param => {
      if (param.indexOf("=") !== -1) {
        let [key, value] = param.split("=");
        paramsObj[key] = value;
      }
    });

    if (paramsObj.code) {
      const Code = paramsObj.code;
      fetch(`https://api.igame.qq.com/merc.plugin.commercial_cgi.commercial_cgi/GetCommercialGift?tstamp=${Date.now()}&g_app_tk=816249561`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json;charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "cookie": "pgv_info=ssid=s5129116233; pgv_pvid=6370730541; RK=QSUxT/pb3A; ptcz=7040ce724653feea2f81a6a6eec174e7368209674cecee1616a956727d9bf80a; _qpsvr_localtk=0.0938942593038854; eas_sid=7177Y4w0F9W1a1d2V2C9z9u1A0; uin=o2135317370; skey=@PKZJqRL3t; tiplogin_accesstoken=0E1ED2891FE2BE810D62EFDBEABACE06; tiplogin_openid=49BB7D9D915AB9C17922ED68F50ADD34; tiplogin_refreshtoken=DEA3AE7D564A696CA93CEB26140CC0A0; tiplogin_type=tiploginqq; tiplogin_sessionid=004a40b1eff511efbe7586ac78dac37f7HFD870n0Kess6OJ; tiplogin_nick=%E4%B8%8D%E8%A8%80; tiplogin_headurl=http://thirdqq.qlogo.cn/ek_qqapp/AQP7ow4K46iaoHgGhpicFLpzdn3QoUz7zicYLa7sq9D0mq3hbRRPHFtKlcX7wict9Dh9u5YO854VTsIN4QfKfDUxjEicWZmVeNFgWnCcxu5JYoHib3TIT6Vfo/0; tiplogin_gender=1; tip_token=816249561",
          "Referer": "https://h5.igame.qq.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"redeem_code\":\"" + Code + "\",\"role_info\":{\"role_idx\":\"b89a892e7b08a4a8fe699f0b9f06fd81\",\"subarea\":2134},\"device\":0,\"exchange_param\":{\"echange_water_log\":{\"src_channel\":\"vertical_h5\",\"src_module\":\"pay_zhifa_libao\",\"create_brand_id\":\"b1683614611\"}}}",
        "method": "POST"
      }).then(res => res.json()).then((data) => {
        if (data.err_msg) {
          // console.log(data.err_msg);
          response.end(JSON.stringify({ code: 1, data: paramsObj.code, msg: data.err_msg }));
        } else {
          response.end(JSON.stringify({ code: 1, data: paramsObj.code, msg: "领取成功!" }));
        }
      }).catch(console.error);

      return;
    }
    return response.end(`{"code":0}`);
  } else {

    let filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("404 Not Found");
      } else {
        response.writeHead(200, { "Content-Type": getContentType(filePath) });
        response.end(data);
      }
    });
  }

  return
}
httpServer.listen(port, function () {
  console.log(`app is running at port:${port}`);
  console.log(`url: http://localhost:${port}`);
});

// const Code = "bizGiftCode.4FL3UH6NQ";
