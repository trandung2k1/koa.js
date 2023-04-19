class SiteController {
    static async getHomePage(ctx) {
        await ctx.render('index', { title: 'Home Page' });
    }
    static async getAboutPage(ctx) {
        await ctx.render('about', { title: 'About Page' });
    }
}

module.exports = SiteController;
