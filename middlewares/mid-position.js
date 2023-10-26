const Ut = require('../utils/utils');
const { SudokuHelper } = require('../utils/sudoku-helper');
const sdh = new SudokuHelper();
exports.mid_position = (req, res, next) => {
    const value = req.body.value;
    const coordinate = req.body.coordinate;
    const coords = sdh.formatCoordinate(coordinate)
    if (value === '' || coordinate === '') {
        res.json({ "error": "Required field(s) missing" });
    }
    if (!Ut.isObject(coords)) {
        res.json({ "error": "Invalid coordinate" });
    }
    else if (!sdh.isValidValue(value)) {
        res.json({ "error": "Invalid value" });
    }
    else{
        res.locals.coords = coords
        next();
    }
}