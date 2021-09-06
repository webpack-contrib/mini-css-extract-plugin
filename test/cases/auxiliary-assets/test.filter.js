import yn from "../../helpers/yn";

module.exports = () => !yn(process.env.EXPERIMENTAL_USE_IMPORT_MODULE);
