// backend/middleware/csrf.middleware.ts

import csrf from 'csurf';

// TODO: Enable Csrf
export const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false, // TODO: Set to true in production
        sameSite: 'lax',
    },
});


