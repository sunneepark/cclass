const jwt = require('jsonwebtoken');

module.exports = {
    sign : function(user_idx){ 
        const options = { 
            algorithm : "HS256", 
            expiresIn : 60 * 60 * 24 * 30 // 30 days 
        }; 
        const payload = {  
            user_idx : user_idx
        }; 
        let token = jwt.sign(payload, "sdfs", options);
        return token; 
    }, 

    verify : function(token) { 
        let decoded; 
        try {
            decoded = jwt.verify(token, "sdfs"); 
        }
        catch(err) {
            if(err.message === 'jwt expired') console.log('expired token');
            else if(err.message === 'invalid token') console.log('invalid token');
            return -1;
        }
        if(!decoded) { 
            return -1;
        }else {
            return decoded; 
        }
    }
}