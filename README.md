# Лабораторная работа: Docker Compose (Вариант 17)

## Описание проекта
Многокомпонентное приложение для проверки валидности Email-адресов.
Включает 4 контейнера:
1. **Frontend**: Веб-интерфейс (HTML/JS/CSS, Nginx).
2. **Backend**: REST API (Node.js, Express) для работы с БД и Web-сервисом.
3. **Database**: СУБД (PostgreSQL) для хранения контрагентов.
4. **Web-service**: Микросервис (Node.js), осуществляющий валидацию формата email и проверку MX-записей через DNS.

## Инструкция по запуску
1. Убедитесь, что у вас установлен Docker и Docker Compose.
2. В корневой директории выполните команду:
   ```bash
   docker compose up -d --build
   ```
3. Откройте в браузере: `http://localhost:8080`

## Архитектура
- `Frontend` -> `Backend (порты 8080 и 3000)`
- `Backend` -> `Database (PostgreSQL 5432)`
- `Backend` -> `Web-service (порт 3001 внутри сети)`
