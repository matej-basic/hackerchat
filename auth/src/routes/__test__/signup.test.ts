import  request  from "supertest";
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:"test@test.com",
            password:"passwird"
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:"invalidtest.com",
            password:"passwird"
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:"invalid@test.com",
            password:"fd"
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('dissallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "passowrd"
        })
        .expect(201);

        await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "passowrd"
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "passowrd"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});