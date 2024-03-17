import bcrypt


# Hash a password using bcrypt
def hash_password(password):
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(
        password=pwd_bytes, salt=salt
    )
    return hashed_password.decode("utf-8")


# Check if the provided password matches the stored password (hashed)
def verify_password(
    plain_password: str, hashed_password: str
):
    plain_bytes = plain_password.encode("utf-8")
    password_byte_enc = hashed_password.encode("utf-8")
    return bcrypt.checkpw(
        password=plain_bytes,
        hashed_password=password_byte_enc,
    )
