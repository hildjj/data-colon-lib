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

data // rfc2397, errata 2045
  = u:uric* { return u.join('') } // Can't use $ because of escaped

parameter // rfc2231
  = regular_parameter
  / extended_parameter

regular_parameter // rfc2231
  = @$regular_parameter_name "=" @value

regular_parameter_name // rfc2231
  = attribute section?

value // rfc 2045
  = token
  / quoted_string

attribute // rfc2231
  = attribute_char+

attribute_char // rfc2231
  // <any (US-ASCII) CHAR except SPACE, CTLs, "*", "'", "%", or tspecials>
  = [!#$&+.0-9A-Z^_`a-z{|}~-]

section // rfc2231
  = initial_section
  / other_sections

initial_section // rfc2231
  = "*0"

other_sections // rfc2231
  = "*" [1-9] DIGIT*

extended_parameter // rfc2231
  = extended_initial_name "=" extended_initial_value
  / extended_other_names "=" extended_other_values

extended_initial_name // rfc2231
  = attribute initial_section? "*"

extended_initial_value // rfc2231
  = charset? "'" language? "'" extended_other_values

charset // rfc2231
  // registered charset name
  = mime_charset

mime_charset // rfc2978
  = mime_charset_chars+

mime_charset_chars // rfc2978
  = ALPHA
  / DIGIT
  / [!#$%&'+\-^_`{}~]

language // rfc 2231
  // registered language tag
  = Language_Tag

Language_Tag // rfc4646
  = langtag
  / privateuse
  / grandfathered

langtag // rfc4646
  = lang ("-" script)? ("-" region)? ("-" variant)* ("-" extension)* ("-" privateuse)?

lang // rfc4646
  = ALPHA ALPHA ALPHA ALPHA ALPHA ALPHA? ALPHA? ALPHA? // registered language subtag
  / ALPHA ALPHA ALPHA ALPHA     // reserved for future use
  / ALPHA ALPHA ALPHA? extlang? // shortest ISO 639 code

extlang // rfc4646
 = "-" alpha3 ("-" alpha3)? ("-" alpha3)?

privateuse // rfc4646
  = "x"i ("-" alphanum18)+

grandfathered // rfc4646
  = alpha13 ("-" alphanum28) ("-" alphanum28)?

script // rfc4646
  = ALPHA ALPHA ALPHA ALPHA

region // rfc4646
  = ALPHA ALPHA
  / DIGIT DIGIT DIGIT

variant // rfc4646
  = alphanum58
  / DIGIT alphanum alphanum alphanum

extension // rfc4646
  = singleton ("-" alphanum28)+

singleton // rfc4646
  = [\x41-\x57\x59-\x5A\x61-\x77\x79-\x7A0-9]

alpha3 // 3ALPHA
  = ALPHA ALPHA ALPHA

alpha13 // 1*3ALPHA
  = ALPHA ALPHA? ALPHA?

alphanum18 // 1*8alphanum
  = alphanum alphanum? alphanum? alphanum? alphanum? alphanum? alphanum? alphanum?

alphanum28 // 2*8alphanum
  = alphanum alphanum alphanum? alphanum? alphanum? alphanum? alphanum? alphanum?

alphanum58 // 5*8alphanum
  = alphanum alphanum alphanum alphanum alphanum alphanum? alphanum? alphanum?

alphanum // rfc4646
  = ALPHA
  / DIGIT

extended_other_names // rfc2231
  = attribute other_sections "*"

extended_other_values // rfc2231
  = (ext_octet / attribute_char)*

ext_octet // rfc2231
  = pct_encoded

quoted_string // rfc5322
  = CFWS? '"' @$(FWS? qcontent)* FWS? '"' CFWS?

qcontent // rfc 5332
  = qtext
  / quoted_pair

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

CFWS // rfc 5332
  = (FWS? comment)+ FWS?
  / FWS

FWS // rfc 5332: Folding white space
  = ((WSP* CRLF)? WSP+)
  / obs_FWS

comment // rfc 5332
  = "(" (FWS? ccontent)* FWS? ")"

ccontent // rfc 5332
  = ctext
  / quoted_pair
  / comment

ctext // rfc 5332
  // Printable US-ASCII characters not including "(", ")", or "\"
  = [\x21-\x27\x2a-\x5b\x5d-\x7e]
  / obs_ctext

obs_ctext // rfc 5332
  = obs_NO_WS_CTL

obs_NO_WS_CTL // rfc 5332: US-ASCII control characters except CR, LF, WS
  = [\x01-\x08\x0b\x0c\x0e-\x1f\x7f]

obs_FWS // rfc 5332: Obsolete Folding White Space
  = WSP+ (CRLF WSP+)*

CRLF // rfc 5332: described in section 2.1
  = CR LF

CR // rfc 5332, implied
  = "\r"
LF // rfc 5332, implied
  = "\n"

VCHAR // RFC 5234 appendix-B.1
  = [\x21-\x7E]

WSP // RFC 5234 appendix-B.1
  =  [ \t]

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
  = "%" hex:$(HEXDIG HEXDIG) { return String.fromCharCode(parseInt(hex, 16)) }

HEXDIG // rfc5234
  = DIGIT
  / [a-f]i

ALPHA // rfc5234
  = [\x41-\x5A\x61-\x7A]

DIGIT // rfc5234
  = [\x30-\x39]
