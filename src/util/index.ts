import { Request } from 'express';

export const getToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Handle token presented as URI param
    return req.query.token;
  } else if (req.cookies && req.cookies.token) {
    // Handle token presented as a cookie parameter
    return req.cookies.token;
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
  return null;
};

export const arrayShuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const generateRandomNumber = (from, to) => {
  return Math.floor(Math.random() * to) + from;
};

export const rollDice = count => {
  const res = [];
  for(let i = 0; i< count; i++){
    res.push(generateRandomNumber(1, 6));
  }
  return res;
};

export const Timer = ({value, onEnd, onTick, pause}) => {
  const data = {
    value,
    t: null,
    pause,
    onTick,
    onEnd
  };
  
  return {
    tick: function(){
      if (data.value > 0 && !data.pause) {
        data.t = setTimeout(() => {
          data.value -= 1;
          data.onTick(data.value);
          this.tick();
        }, 1000);
      } else {
        if (data.t && !data.pause) {
          data.onEnd()
        }
      }
    },
    set: function(args){
      Object.keys(args).forEach(k => {
        data[k] = args[k];
      })
    },
    clear: function() {
      clearTimeout(data.t);
    },
    init: function(value) {
      clearTimeout(data.t);
      data.value = value;
      this.tick();
    }
  }
};


export const dataExpire = Number.isNaN(Number(process.env.DATA_EXPIRE)) ? 172800 : Number(process.env.DATA_EXPIRE);