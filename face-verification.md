Request: 82/82 Code: 0 Duration: 48.84 ms Time: Sep 08 02:02:32 PM
URL: POST https://shillong.meg.nic.in/PensionersApp/v1/api/verification/ Env: default Status: 500 Assert: success
Buffer: http/index.http::57 Name: Verification

# `POST` `https://shillong.meg.nic.in/PensionersApp/v1/api/verification/`

## Request

`POST` `https://shillong.meg.nic.in/PensionersApp/v1/api/verification/`

### Request headers

| Header        | Value                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization | `accessToken eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDMwMDAwMDAwMSIsInVzZXJuYW1lIjoiTUcvU0YvMTc4NDMiLCJleHAiOjE3ODg4NzY1NzZ9.4nGDGOqcIl9GG7rkVfHqhyzR9Z1Qh0UihTaT63ab7g8` |
| Content-Type  | `application/x-www-form-urlencoded`                                                                                                                                                     |
| User-Agent    | `kulala-core/0.37.0`                                                                                                                                                                    |

### Request body

```text
image_1=gAAAAABqn8U7FdRvEaGc9Utpe-zmiT2RtgwbsALeHWoqv07IU9a4AUvQxau9h2BPhn4aVdyjetxAVQx1e4FjxdXzP8GxdGAhh6i74x6Q3OEBovvc7bNWqDo%3D&image_2=gAAAAABqn8U7FdRvEaGc9Utpe-zmiT2RtgwbsALeHWoqv07IU9a4AUvQxau9h2BPhn4aVdyjetxAVQx1e4FjxdXzP8GxdGAhh6i74x6Q3OEBovvc7bNWqDo%3D&version=24
```

## Response - HTTP `500`

### Response headers

| Header                  | Value                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| allow                   | `POST, OPTIONS`                                                            |
| connection              | `keep-alive`                                                               |
| content-length          | `34`                                                                       |
| content-security-policy | `default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self';` |
| content-type            | `application/json`                                                         |
| date                    | `Tue, 08 Sep 2026 14:04:59 GMT`                                            |
| server                  | `nginx`                                                                    |
| x-content-type-options  | `nosniff, nosniff`                                                         |
| x-frame-options         | `DENY, DENY`                                                               |

### Response body

```json
{
  "msg": "Error: Unable to process"
}
```

## Connection trace

### Connection & TLS

- `Host shillong.meg.nic.in:443 was resolved.`
- `IPv6: (none)`
- `IPv4: 164.100.150.130`
- `Trying 164.100.150.130:443...`
- `ALPN: curl offers h2,http/1.1`
- `TLSv1.3 (OUT), TLS handshake, Client hello (1):`
- `SSL Trust Anchors:`
- `CAfile: /etc/ssl/certs/ca-certificates.crt`
- `TLSv1.3 (IN), TLS handshake, Server hello (2):`
- `TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):`
- `TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):`
- `TLSv1.3 (IN), TLS handshake, Certificate (11):`
- `TLSv1.3 (IN), TLS handshake, CERT verify (15):`
- `TLSv1.3 (IN), TLS handshake, Finished (20):`
- `TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):`
- `TLSv1.3 (OUT), TLS handshake, Finished (20):`
- `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS`
- `ALPN: server accepted http/1.1`
- `Server certificate:`
- `subject: CN=shillong.meg.nic.in`
- `start date: Aug  5 04:34:29 2026 GMT`
- `expire date: Nov  3 04:34:28 2026 GMT`
- `issuer: C=US; O=Let's Encrypt; CN=YR1`
- `Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 1: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 2: Public key type RSA (4096/152 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 3: Public key type RSA (4096/152 Bits/secBits), signed using sha256WithRSAEncryption`
- `subjectAltName: "shillong.meg.nic.in" matches cert's "shillong.meg.nic.in"`
- `OpenSSL verify result: 0`
- `SSL certificate verified via OpenSSL.`
- `Established connection to shillong.meg.nic.in (164.100.150.130 port 443) from 10.179.36.72 port 60010`
- `using HTTP/1.x`
- `upload completely sent off: 272 bytes`
- `TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):`
- `TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):`
- `Connection #0 to host shillong.meg.nic.in:443 left intact`

### Request (from trace)

| Header         | Value                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host           | shillong.meg.nic.in                                                                                                                                                                   |
| Accept         | `*/*`                                                                                                                                                                                 |
| Content-Type   | application/x-www-form-urlencoded                                                                                                                                                     |
| Authorization  | accessToken eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDMwMDAwMDAwMSIsInVzZXJuYW1lIjoiTUcvU0YvMTc4NDMiLCJleHAiOjE3ODg4NzY1NzZ9.4nGDGOqcIl9GG7rkVfHqhyzR9Z1Qh0UihTaT63ab7g8 |
| User-Agent     | kulala-core/0.37.0                                                                                                                                                                    |
| Content-Length | 272                                                                                                                                                                                   |

### Response (from trace)

**Status:** `HTTP/1.1 500 Internal Server Error`

| Header                  | Value                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| Server                  | nginx                                                                    |
| Date                    | Tue, 08 Sep 2026 14:04:59 GMT                                            |
| Content-Type            | application/json                                                         |
| Content-Length          | 34                                                                       |
| Connection              | keep-alive                                                               |
| Allow                   | POST, OPTIONS                                                            |
| X-Frame-Options         | DENY                                                                     |
| X-Content-Type-Options  | nosniff                                                                  |
| Content-Security-Policy | default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self'; |
| X-Frame-Options         | DENY                                                                     |
| X-Content-Type-Options  | nosniff                                                                  |

### Trace (other)

```text
} [5 bytes data]
} [1574 bytes data]
{ [5 bytes data]
{ [122 bytes data]
{ [1 bytes data]
{ [25 bytes data]
{ [4080 bytes data]
{ [264 bytes data]
{ [52 bytes data]
} [1 bytes data]
} [52 bytes data]
} [5 bytes data]
} [272 bytes data]
{ [5 bytes data]
{ [281 bytes data]
{ [281 bytes data]
{ [34 bytes data]
```

## Transfer timings

| Phase         |     ms |
| ------------- | -----: |
| namelookup    |  1.043 |
| connect       |  1.390 |
| appconnect    |  6.504 |
| pretransfer   | 48.743 |
| starttransfer | 30.053 |
| redirect      |  0.000 |

---

## --- URL ENCODED BODY ---

Request: 83/83 Code: 0 Duration: 275.34 ms Time: Sep 08 02:03:36 PM
URL: POST https://shillong.meg.nic.in/PensionersApp/v1/api/verification/ Env: default Status: 500 Assert: success
Buffer: http/index.http::57 Name: Verification

# `POST` `https://shillong.meg.nic.in/PensionersApp/v1/api/verification/`

## Request

`POST` `https://shillong.meg.nic.in/PensionersApp/v1/api/verification/`

### Request headers

| Header        | Value                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization | `accessToken eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDMwMDAwMDAwMSIsInVzZXJuYW1lIjoiTUcvU0YvMTc4NDMiLCJleHAiOjE3ODg4NzY1NzZ9.4nGDGOqcIl9GG7rkVfHqhyzR9Z1Qh0UihTaT63ab7g8` |
| Content-Type  | `application/x-www-form-urlencoded`                                                                                                                                                     |
| User-Agent    | `kulala-core/0.37.0`                                                                                                                                                                    |

### Request body

```text
image_1=.%2Fignore-base64-2.json
```

## Response - HTTP `500`

### Response headers

| Header                  | Value                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| allow                   | `POST, OPTIONS`                                                            |
| connection              | `keep-alive`                                                               |
| content-length          | `34`                                                                       |
| content-security-policy | `default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self';` |
| content-type            | `application/json`                                                         |
| date                    | `Tue, 08 Sep 2026 14:06:04 GMT`                                            |
| server                  | `nginx`                                                                    |
| x-content-type-options  | `nosniff, nosniff`                                                         |
| x-frame-options         | `DENY, DENY`                                                               |

### Response body

```json
{
  "msg": "Error: Unable to process"
}
```

## Connection trace

### Connection & TLS

- `Host shillong.meg.nic.in:443 was resolved.`
- `IPv6: (none)`
- `IPv4: 164.100.150.130`
- `Trying 164.100.150.130:443...`
- `ALPN: curl offers h2,http/1.1`
- `TLSv1.3 (OUT), TLS handshake, Client hello (1):`
- `SSL Trust Anchors:`
- `CAfile: /etc/ssl/certs/ca-certificates.crt`
- `TLSv1.3 (IN), TLS handshake, Server hello (2):`
- `TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):`
- `TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):`
- `TLSv1.3 (IN), TLS handshake, Certificate (11):`
- `TLSv1.3 (IN), TLS handshake, CERT verify (15):`
- `TLSv1.3 (IN), TLS handshake, Finished (20):`
- `TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):`
- `TLSv1.3 (OUT), TLS handshake, Finished (20):`
- `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS`
- `ALPN: server accepted http/1.1`
- `Server certificate:`
- `subject: CN=shillong.meg.nic.in`
- `start date: Aug  5 04:34:29 2026 GMT`
- `expire date: Nov  3 04:34:28 2026 GMT`
- `issuer: C=US; O=Let's Encrypt; CN=YR1`
- `Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 1: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 2: Public key type RSA (4096/152 Bits/secBits), signed using sha256WithRSAEncryption`
- `Certificate level 3: Public key type RSA (4096/152 Bits/secBits), signed using sha256WithRSAEncryption`
- `subjectAltName: "shillong.meg.nic.in" matches cert's "shillong.meg.nic.in"`
- `OpenSSL verify result: 0`
- `SSL certificate verified via OpenSSL.`
- `Established connection to shillong.meg.nic.in (164.100.150.130 port 443) from 10.179.36.72 port 52388`
- `using HTTP/1.x`
- `upload completely sent off: 32 bytes`
- `TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):`
- `TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):`
- `Connection #0 to host shillong.meg.nic.in:443 left intact`

### Request (from trace)

| Header         | Value                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host           | shillong.meg.nic.in                                                                                                                                                                   |
| Accept         | `*/*`                                                                                                                                                                                 |
| Content-Type   | application/x-www-form-urlencoded                                                                                                                                                     |
| Authorization  | accessToken eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDMwMDAwMDAwMSIsInVzZXJuYW1lIjoiTUcvU0YvMTc4NDMiLCJleHAiOjE3ODg4NzY1NzZ9.4nGDGOqcIl9GG7rkVfHqhyzR9Z1Qh0UihTaT63ab7g8 |
| User-Agent     | kulala-core/0.37.0                                                                                                                                                                    |
| Content-Length | 32                                                                                                                                                                                    |

### Response (from trace)

**Status:** `HTTP/1.1 500 Internal Server Error`

| Header                  | Value                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| Server                  | nginx                                                                    |
| Date                    | Tue, 08 Sep 2026 14:06:04 GMT                                            |
| Content-Type            | application/json                                                         |
| Content-Length          | 34                                                                       |
| Connection              | keep-alive                                                               |
| Allow                   | POST, OPTIONS                                                            |
| X-Frame-Options         | DENY                                                                     |
| X-Content-Type-Options  | nosniff                                                                  |
| Content-Security-Policy | default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self'; |
| X-Frame-Options         | DENY                                                                     |
| X-Content-Type-Options  | nosniff                                                                  |

### Trace (other)

```text
} [5 bytes data]
} [1574 bytes data]
{ [5 bytes data]
{ [122 bytes data]
{ [1 bytes data]
{ [25 bytes data]
{ [4080 bytes data]
{ [264 bytes data]
{ [52 bytes data]
} [1 bytes data]
} [52 bytes data]
} [5 bytes data]
} [32 bytes data]
{ [5 bytes data]
{ [281 bytes data]
{ [281 bytes data]
{ [34 bytes data]
```

## Transfer timings

| Phase         |      ms |
| ------------- | ------: |
| namelookup    |   1.087 |
| connect       |   5.257 |
| appconnect    |  22.799 |
| pretransfer   | 275.246 |
| starttransfer | 236.076 |
| redirect      |   0.000 |
