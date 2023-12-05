CREATE TABLE "User" (
  "id" uuid PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "name" varchar,
  "password" varchar,
  "isVerfied" varchar,
  "is_online" boolean,
  "registration_otp" varchar,
  "registration_otp_exp" number,
  "refresh_hash" string,
  "profile" UserProfileEntity,
  "chats" [UserChatEntity],
  "chats_requests" [ChatRequestEntity],
  "created_at" Date,
  "updated_at" date
);

CREATE TABLE "UserProfileEntity" (
  "id" uuid PRIMARY KEY,
  "profile_pic" CloudinaryImageEntity,
  "about" string
);

CREATE TABLE "CloudinaryImageEntity" (
  "id" uuid PRIMARY KEY,
  "public_id" varchar,
  "format" varchar
);

CREATE TABLE "UserChatEntity" (
  "user_id" uuid PRIMARY KEY,
  "name" varchar,
  "is_online" boolean,
  "messages" [Message]
);

CREATE TABLE "Message" (
  "id" uuid PRIMARY KEY,
  "sender_id" uuid,
  "reciever_id" uuid,
  "content" string,
  "is_seen" boolean,
  "sended_at" Date,
  "seen_at" Date
);

CREATE TABLE "ChatRequestEntity" (
  "id" uuid PRIMARY KEY,
  "requester" User,
  "acceptor" User,
  "status" "pending, rejected, accepted",
  "requested_at" Date
);

ALTER TABLE "UserProfileEntity" ADD FOREIGN KEY ("id") REFERENCES "User" ("profile");

ALTER TABLE "CloudinaryImageEntity" ADD FOREIGN KEY ("id") REFERENCES "UserProfileEntity" ("profile_pic");

ALTER TABLE "User" ADD FOREIGN KEY ("chats") REFERENCES "UserChatEntity" ("user_id");

ALTER TABLE "UserChatEntity" ADD FOREIGN KEY ("messages") REFERENCES "Message" ("id");

ALTER TABLE "User" ADD FOREIGN KEY ("chats_requests") REFERENCES "ChatRequestEntity" ("id");
