const request = require('supertest');//Importa una herramienta que permite hacer pruebas a tu API como si fuera Postman
const app = require('../app');
const { calculateValue } = require('../lib/logic');//Importa la función calculateValue para poder probarla.

describe('Suite de Pruebas de Calidad de Software', () => {

    describe('Pruebas Unitarias - Lógica de Inventario', () => {
        test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
            const result = calculateValue(10, 5);
            expect(result).toBe(50);
        });

        test('Debe retornar 0 si se ingresan valores negativos', () => {
            const result = calculateValue(-10, 5);
            expect(result).toBe(0);
        });

        //Que cuando el stock es negativo, el sistema no haga la multiplicación y regrese 0.
        test('Debe retornar 0 si el stock es negativo', () => {
            const result = calculateValue(10, -5)
            expect(result).toBe(0)
        })
        //Que el sistema maneje correctamente el caso límite donde todo es 0.
        test('Debe retornar 0 cuando precio y stock son 0', () => {
            const result = calculateValue(0, 0)
            expect(result).toBe(0)
        });

    });


    describe('Pruebas de Integración - API Endpoints', () => {
        test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
            const response = await request(app).get('/health');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
        });

        test('GET /items - Debe validar la estructura del inventario', async () => {
            const response = await request(app).get('/items');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // Validamos que el primer objeto tenga las propiedades requeridas
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('stock');
        });
    
        //Que cada item del inventario tenga un stock numérico.
        test('GET /items - Cada item debe tener stock numérico', async () => {
            const response = await request(app).get('/items')
            expect(typeof response.body[0].stock).toBe('number')
        });

            //Que el sistema maneje correctamente las rutas que no existen, devolviendo un error 404.
        test('Ruta inexistente debe devolver 404', async () => {
            const response = await request(app).get('/no-existe')
            expect(response.statusCode).toBe(404)
        });
    });
});
