const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const ingredientController = require("../../build/controllers/ingredient").ingredientController;

let mockRequest = {
    get : function (){return "toto"},
    body: {
        name: "name",
        consumable: "consumable",
        category: "category",
        unitOfMeasure: "unitOfMeasure",
        shelfLife: 10,
        freezable: true
    },
    file: {
        filename: "filename"
    }
}

let mockResponse = {
    status : jest.fn().mockReturnValue({json: jest.fn()})
}

test('writeIngredient', async () => {

    jest.spyOn(baseIngredient, "register").mockResolvedValue("OK");
    
    await ingredientController.writeIngredient(mockRequest, mockResponse);

    let mock = mockResponse.status().json.mock.calls;

    expect(JSON.parse(JSON.stringify(mock))).toMatchObject([["OK"]]);
});