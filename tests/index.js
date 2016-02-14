import assert from 'assert';


describe('Tests', () => {

    it('Should work with literals', () => {
        assert(5 == 7);
        assert(7 == 5);
    });

    it('Should compare ratings correctly', () => {
        var movie1 = {
            title: 'Fight Club',
            rating: 5,
        };

        var movie2 = {
            title: 'The Dark Night',
            director: 'Nistopher Colon',
            rating: 7,
        };

        var movie3 = {
            title: 'Toy Story 3',
            rating: 6,
        };

        assert(movie1.rating == movie2.rating);
        assert(movie2.rating == movie1.rating);
        assert(movie1.rating != movie3.rating);
        assert(movie2.rating != movie3.rating);
    });

    it('Should work with `this`', () => {
        var movie = {
            rating: 5,
            isRatingEqualTo(rating) {
                return this.rating == rating;
            },
        };

        assert(movie.isRatingEqualTo(7));
        assert(movie.isRatingEqualTo(5));
        assert(!movie.isRatingEqualTo(6));
    });

});
