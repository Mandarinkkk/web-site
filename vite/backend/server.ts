import { PrismaClient } from '@prisma/client';
import * as http from 'http';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
    if (req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const parsedData = JSON.parse(body);

                if (req.url === '/register') {
                    const { name, email, password } = parsedData;

                    const existingUser = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (existingUser) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Пользователь с таким email уже существует.' }));
                        return;
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = await prisma.user.create({
                        data: { name, email, password: hashedPassword },
                    });

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Регистрация успешна!', user: { email: newUser.email, name: newUser.name } }));
                } else if (req.url === '/login') {
                    const { email, password } = parsedData;

                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Неверный email или пароль.' }));
                        return;
                    }

                    if (user.password) {
                    const isPasswordValid = bcrypt.compare(password, user.password);
                    
                    if (!isPasswordValid) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Неверный email или пароль.' }));
                        return;
                    }
                  } else {
                    console.error('Пароль отсутствует у пользователя.');
                }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Авторизация успешна!', user: { email: user.email, name: user.name } }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Маршрут не найден.' }));
                }
            } catch (error: unknown) {
                console.error('Ошибка на сервере:', error instanceof Error ? error.message : error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Внутренняя ошибка сервера.' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Страница не найдена</h1>');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
