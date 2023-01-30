dataurl // rfc2397
  = "data:" mediatype:mediatype? b64:";base64"? "," data:data {
    return {
      mediatype,
      base64: Boolean(b64),
      data
    }
  }

mediatype // rfc2397
  = ts:(@type "/" @subtype)? parameters:parameters {
    return {
      type: ts?.[0],
      subtype: ts?.[1],
      parameters
    }
  }

parameters // Derived from rfc2397
  = parms:( ";" @parameter )* {
    return Object.fromEntries(parms)
  }

type // rfc2045
  = discrete_type
  / composite_type

subtype // rfc2045
  = extension_token
  / iana_token

iana_token // rfc2045
  = token // Not going to track the IANA page

discrete_type // rfc2045
  = "text"
  / "image"
  / "audio"
  / "video"
  / "application"
  / extension_token

composite_type // rfc 2045
  = "message"
  / "multipart"

extension_token // rfc2045
  = ietf_token
  / x_token

ietf_token // https://www.iana.org/assignments/media-types/media-types.xhtml
  = "font"
  / "example"
  / "model"

x_token // rfc2045
  // The two characters "X-" or "x-" followed, with
  // no intervening white space, by any token
  = "x-"i token

composite_type // rfc2045

data // rfc2397, errata 2045
  = u:uric* { return u.join('') } // Can't use $ because of escaped

parameter // rfc2045
  = @attribute "=" @value

attribute // rfc2045
  = token

value // rfc2045
  = token
  / quoted_string

quoted_string // rfc5322
  = '"' @$(qtext / quoted_pair)* '"'

qtext // rfc 5332: Printable US-ASCII, not including \ or "
  = [\x21\x23-\x5b\x5d-\x7e]
  / obs_qtext

obs_qtext // rfc 5332
  = obs_NO_WS_CTL

quoted_pair // rfc 5332
  =  ("\\" (VCHAR / WSP))
  / obs_qp

obs_qp // rfc 5332
  = "\\" ("\x00" / obs_NO_WS_CTL / LF / CR)

obs_NO_WS_CTL // rfc 5332: US-ASCII control characters except CR, LF, WS
 = [\x01-\x08\x0b\x0c\x0e-\x1f\x7f]

FWS // rfc 5332: Folding white space
  = ((WSP* CRLF)? WSP+)
  / obs_FWS

obs_FWS // rfc 5332: Obsolete Folding White Space
  = WSP+ (CRLF WSP+)*

CR // rfc 5332, implied
  = "\r"
LF // rfc 5332, implied
  = "\n"

CRLF // rfc 5332: described in section 2.1
  = CR LF

VCHAR // RFC 5234 appendix-B.1
  = [\x21-\x7E]

WSP // RFC 5234 appendix-B.1
  =  [ \t]

token // rfc2045
  = $tokenc+

tokenc // rfc2045
  // any (US-ASCII) CHAR except SPACE, CTLs, or tspecials
  = [!#$%&'*+.0-9A-Z^_`a-z{|}~-]

uric // rfc2396
  = escaped
  / reserved
  / unreserved

unreserved // rfc2396
  = alphanum
  / mark

mark // rfc2396
  = [-_.!~*'()]

reserved // rfc2396
  = [;/?:@&=+$,]

escaped // rfc2396
  = "%" h1:hex h2:hex { return String.fromCharCode(parseInt(h1+h2, 16)) }

hex // rfc2396
  = digit
  / [a-f]i

alphanum // rfc2396
  = alpha
  / digit

alpha // rfc2396
  = [a-z]i

digit // rfc2396
  = [0-9]
