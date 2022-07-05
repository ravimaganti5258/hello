export const EMAIL_REGX =
  /^(([^<>()[\]\\.,;:\s@_"#%]+(\.[^<>()[\]\\.,;:\s@_"#%]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  export const EMAIL_REGX2 =
  /^(([^<>()[\]\\.,;:\s@_"#%]+(\.[^<>()[\]\\.,;:\s@_"#%]+)*)|(".+")){1,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
export const TEXT_ONLY = /^[a-zA-Z]+$/;
export const NAME_REGEX =
  /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;.,-:[\]]{2,}$/;

export const PHONE_NUM_REGEX = /^(0|91? ?|\+91? ?)?-?[789]\d{9}$/;

export const IMAGE_FORMAT_REGEX = /\.(jpeg|png|webp)$/i;

export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=(.*[a-z]){2})(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/;

// export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[A-Z])(?=(.*[a-z]){2})(?=(.*[`!@#$%\^&*\-_=\+'\/\.,]){2}){6,}$/
//  export const PASSWORD_REGEX =  /.*/
