export class Router {
    #title = "No title";
    #basePath = "/";
    #router;

    initialise() {}
    initialiseRoutes() {}

    constructor(app, router) {
        console.log("Router");
        this.#router = router;
    }

    get(layout, params = null) {
        let title = this.#title;
        return #router.get(this.#basePath, function(req, res, next) {
            res.render(layout + '.pug', { title:  title});
        });
    }

    setTitle(title) {
        this.#title = title;
    }

    getTitle() {
        return this.#title;
    }

    setBasePath(title) {
        this.#title = title;
    }

    getBasePath() {
        return this.#title;
    }
}