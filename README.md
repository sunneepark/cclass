# cclass

#### ```화학실험보고서 작성+제출 플랫폼```


## Plaform 
<img src='https://user-images.githubusercontent.com/37530599/78283510-d9cec500-7558-11ea-9e67-dfa8c5a09a71.png'></img>

학생은 앱을 통해 실험보고서를 제출하고, 교수는 웹을 통해 학생의 보고서를 채점합니다.</br>
본 플랫폼으로 수업마다 다른 보고서의 형식을 통일할 수 있으며,</br>
기존의 수기로 제출하여 생기는 여러 문제점을 해결하고, 문서의 전자화로써 문서 보존에도 큰 도움이 될 것입니다.

## Using 

* Node.js
* express.js
* AWS infra(RDS, EC2, SSL, S3)
* RestFul API ```JSON 형식으로 End Point에 뿌려줌.``` (Swagger API)

* 웹페이지 연동으로 인한 ```var cors = require('cors'); app.use(cors());``` 로 cors 설정

## Setting
**config/ 폴더 생성 후, 아래의 4개 파일**

1. dbPool.js
```node.js
var mysql = require('promise-mysql')

const dbConfig = {
    host : '',
    port : '',
    user : '',
    password : '',
    database : '',
    connectionLimit : 20
 };

module.exports = mysql.createPool(dbConfig);
```

2. awsConfig.json
```node.js
{
	"accessKeyId": "",
	"secretAccessKey" : "",
	"region" : "ap-northeast-2"
}
```

3. multer.js
```node.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: '',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

module.exports = upload;
```

4. secretKey.js
```node.js
module.exports = {
    secret : "(Anykey you want)"
}
```

</br></br>
## Build
```
git clone https://github.com/Weatherook/server
cd server
npm config package-lock false //package-lock 생성 못하게 필요시에
npm start
```

*integrity checksum failed 오류가 나는 경우* **npm cache clean --force 실행**

</br></br>
## Nginx 설정
**웹서버 접속 후, 진행**
1. sudo apt update -y && sudo apt-get install nginx -y
</br>
2. sudo systemctl status nginx
</br>
3. sudo systemctl start nginx , sudo systemctl enable nginx
</br>
4. Nginx 설정파일 수정 ```sudo vi /etc/nginx/sites-available/defalut```

```javascript
server{
	listen 8080;
	sever_name ip;
	location /{
	 proxy_pass http://ip:포트번호;
	 proxy_http_version 1.1;
	 proxy_set_header Upgrade $http_upgrade;
	 proxy_set_header Connection 'upgrade';
	 proxy_set_header Host $host;
	 proxy_cache_bypass $http_upgrade;
	}
	location /public{
	 root /usr/loca/var/www;
	}
     } 
server {
      listen 80;

      server_name ip;

      ## redirect http to https ##
      rewrite (path 정규식 표현으로);

}
```
</br>
5. sudo service nginx restart

## ScreenShots

1. Android App(학생)</br>
![And_img](https://user-images.githubusercontent.com/37530599/78283074-3e3d5480-7558-11ea-9eff-16cb1cf72618.png)

2. Wep(교수)</br>
<img src="https://user-images.githubusercontent.com/37530599/78283537-e2bf9680-7558-11ea-9cd2-ada344b536b8.png" width ="300px" height="350px"></img>
<img src="https://user-images.githubusercontent.com/37530599/78283555-e6ebb400-7558-11ea-8bfd-5250ffa0735e.png" width ="300px" height="350px"></img>


## ERD
<img src="https://user-images.githubusercontent.com/37530599/78283294-8a889480-7558-11ea-8c38-102b10f17176.png" width ="50%" height="50%"></img>

