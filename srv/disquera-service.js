const cds = require('@sap/cds');

module.exports = function () {
    let { Musicians } = this.entities;

    // Cuando un músico tenga 6 horas, o más, de grabación en un día ganan 2 horas de grabación gratis ese día
    this.after('READ', 'Sessions', (req) => {
        for (let i = 0; i < req.length; i++) {
            const session = req[i];
            if (session.hours >= 6) {
                session.hasFreeHours = true;
            }
        }
    });

    // Ingresar músicos de forma masiva
    this.on('CrearMusicos', async (req) => {
        try {
            const result = await INSERT.into(Musicians, req.data.orders)
            return result
        } catch (error) {
            console.log(error)
        }
    });

    this.on('CrearMusico', async (req) => {
        try {
            const result = await INSERT.into(Musicians, req.data.orders)
            return result
        } catch (error) {
            console.log(error)
        }
    });

    this.on('consultarMusico', async req => {
        const { ID } = req.data;
        try {
            const musician = await SELECT.from(Musicians).where({ ID: ID });

            if (!musician) {
                req.error(`Musician with id ${ID} not found`);
            }

            console.log(musician)

        } catch (error) {
            console.log(error)
        }
    });

    this.on('BorrarMusicos', async (req, res) => {

        const ID = req.data.value;
        try {
            const musicians = await SELECT.from(Musicians).columns('first_name', 'last_name').where({ ID: ID });
            await DELETE.from(Musicians, { ID });
            const result = musicians.map(element =>
                `Musico eliminado: ${element.first_name} ${element.last_name}`
            );
            console.log(result)
            return { success: false, message: result };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al eliminar músicos' };
        }
    });
}