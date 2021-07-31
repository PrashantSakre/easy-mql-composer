const url = {
    mongoLocal: "mongodb://localhost:27017",
};

const selectorsId = {
    connButton: "#conn-button",
    connMongoButton: "#connect_mongo",
    mongoButton: "#mongo-url",
    dbDropDownButton: "#db-dropdown-button",
    collDropDownButton: "#coll-dropdown-button",
    runButton: "#run-button",
};

const selectorsClass = {
    dropDownItem: ".dropdown-item",
    aceEditorInputText: ".ace_text-input",
};

const StandardQueries = ["COUNT AS 'Documents';", "COUNT AS 'DOC';"];

const env = Cypress.env();

describe("Easy-mql Run Queries", () => {
    it("Visit and connect to mongo url", () => {
        cy.visit("/").get(selectorsId.connButton).click();
        cy.get("input" + selectorsId.mongoButton)
            .type(url.mongoLocal)
            .get(selectorsId.connMongoButton)
            .click();
    });

    it("select db and collection", () => {
        cy.get(selectorsId.dbDropDownButton).click();
        cy.get(selectorsClass.dropDownItem).contains(env.db).click();
        cy.get(selectorsId.collDropDownButton).click();
        cy.get(selectorsClass.dropDownItem).contains(env.collection).click();
    });

    StandardQueries.map((item) => {
        it("Run queries " + item, () => {
            cy.get(selectorsClass.aceEditorInputText)
                .first()
                .focus()
                .focused()
                .clear()
                .type(item);
            cy.get(selectorsId.runButton).click();
        });
    });

    it("Disconnect from Mongo", () => {
        cy.get(selectorsId.connButton).contains("Disconnect").click();
    });
});
