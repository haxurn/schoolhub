// backend/middleware/csrfMiddleware.ts

import csrf from 'csurf';

export const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false, // TODO: Set to true in production
        sameSite: 'lax',
    },
});

