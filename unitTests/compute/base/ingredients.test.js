const mockingoose = require('mockingoose');

const Ingredient = require("../../../build/models/ingredient").default;
const baseIngredient = require("../../../build/compute/base/ingredient").baseIngredient;

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10,
    freezable: true
}

test('getIngredientNameByID', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientNameByID(ingredient._id);

    expect(result).toBe("name");
});

test('getIngredientByID', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientByID(ingredient._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(ingredient);
});