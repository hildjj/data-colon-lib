dataurl // rfc2397
  = "data:" mediaType:mediatype? b64:";base64"? "," data:data {
    return {
      mediaType,
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
  = x_token
  / iana_token

iana_token // rfc2045
  = token // Not going to track the IANA page

discrete_type // rfc2045
  = "application"
  / "audio"
  / "image"
  / "text"
  / "video"
  / extension_token

composite_type // rfc 2045
  = "message"
  / "multipart"

extension_token // rfc2045
  = x_token
  / ietf_token

ietf_token // https://www.iana.org/assignments/media-types/media-types.xhtml
  = "font"
  / "example"
  / "model"

x_token // rfc2045
  // The two characters "X-" or "x-" followed, with
  // no intervening white space, by any token
  = "x-"i token

data // rfc2397, errata 2045
  = u:uric* { return u.join('') } // Can't use $ because of escaped

// rfc2397 says:
//
// "attribute" and "value" are the corresponding tokens from [RFC2045]
//
// Since this was written after RFC 2231, I'm going to interpret this as
// NOT including the extensions from RFC 2231, since those extensions have
// several productions that are not valid in URIs.
parameter
  = @attribute "=" @value

value // rfc 2045
  = token
  // NOT: quoted_string, see 2397 errata

attribute // rfc2231
  = $attribute_char+

attribute_char // rfc2231
  // <any (US-ASCII) CHAR except SPACE, CTLs, "*", "'", "%", or tspecials>
  = [!#$&+.0-9A-Z^_`a-z{|}~-]

token // rfc2045
  = $tokenc+

tokenc // rfc2045
  // any (US-ASCII) CHAR except SPACE, CTLs, or tspecials
  = [!#$%&'*+.0-9A-Z^_`a-z{|}~-]

uric // rfc3986
  = unreserved
  / pct_encoded
  / [;?:@&=+$,/]

unreserved // rfc3986
  = ALPHA
  / DIGIT
  / [-._~]

pct_encoded // rfc3986
  = "%" hex:$(HEXDIG HEXDIG) {
    return String.fromCharCode(parseInt(hex, 16))
  }

HEXDIG // rfc5234
  = DIGIT
  / [a-f]i

ALPHA // rfc5234
  = [\x41-\x5A\x61-\x7A]

DIGIT // rfc5234
  = [\x30-\x39]
