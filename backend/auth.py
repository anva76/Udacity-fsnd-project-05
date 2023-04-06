import jwt

# Get an auth0 user id from a token
# ---------------------------------------------------------------------
def get_user_id_from_token(token):
    decoded = jwt.decode(token, options={"verify_signature": False})
    return decoded.get("sub", None)


def get_auth_provider_user_id(request):
    auth_header = request.headers.get("Authorization", None)
    if auth_header is None:
        return None

    auth_header = auth_header.split(" ")
    if len(auth_header) < 2 or auth_header[0] != "Bearer":
        return None

    return get_user_id_from_token(auth_header[1])
