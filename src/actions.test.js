import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';

import {
  setAccessToken,
  requestLogin,
} from './features/auth/authSlice';

import {
  loadInitialData,
  setRegions,
  setCategories,
  loadRestaurants,
  setRestaurants,
} from './features/restaurants/restaurantsSlice';

import {
  loadRestaurant,
  setRestaurant,
  setReviews,
  loadReview,
  sendReview,
  clearReviewFields,
} from './features/restaurant/restaurantSlice';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('./services/api');

describe('actions', () => {
  let store;

  describe('loadInitialData', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('runs setRegions and setCategories', async () => {
      await store.dispatch(loadInitialData());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRegions({ regions: [] }));
      expect(actions[1]).toEqual(setCategories({ categories: [] }));
    });
  });

  describe('loadRestaurants', () => {
    context('with selectedRegion and selectedCategory', () => {
      beforeEach(() => {
        store = mockStore({
          restaurants: {
            selectedRegion: { id: 1, name: '서울' },
            selectedCategory: { id: 1, name: '한식' },
          },
        });
      });

      it('runs setRestaurants', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setRestaurants({ restaurants: [] }));
      });
    });

    context('without selectedRegion', () => {
      beforeEach(() => {
        store = mockStore({
          restaurants: {
            selectedCategory: { id: 1, name: '한식' },
          },
        });
      });

      it('does\'nt run any actions', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions).toHaveLength(0);
      });
    });

    context('without selectedCategory', () => {
      beforeEach(() => {
        store = mockStore({
          restaurants: {
            selectedRegion: { id: 1, name: '서울' },
          },
        });
      });

      it('does\'nt run any actions', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions).toHaveLength(0);
      });
    });
  });

  describe('loadRestaurant', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('dispatchs setRestaurant', async () => {
      await store.dispatch(loadRestaurant({ restaurantId: 1 }));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRestaurant({ restaurant: null }));
      expect(actions[1]).toEqual(setRestaurant({ restaurant: {} }));
    });
  });

  describe('requestLogin', () => {
    beforeEach(() => {
      store = mockStore({
        auth: {
          loginFields: { email: '', password: '' },
        },
      });
    });

    it('dispatchs setAccessToken', async () => {
      await store.dispatch(requestLogin());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setAccessToken({ accessToken: {} }));
    });
  });

  describe('loadReview', () => {
    beforeEach(() => {
      store = mockStore({
        auth: {
          loginFields: { email: '', password: '' },
        },
      });
    });

    it('dispatchs setReviews', async () => {
      await store.dispatch(loadReview({ restaurantId: 1 }));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setReviews({ reviews: undefined }));
    });
  });

  describe('sendReview', () => {
    beforeEach(() => {
      store = mockStore({
        auth: {
          accessToken: '',
        },
        restaurant: {
          reviewFields: {
            score: 1,
            description: '',
          },
        },
      });
    });

    it('dispatchs clearReviewFields', async () => {
      await store.dispatch(sendReview({ restaurantId: 1 }));

      const actions = store.getActions();

      expect(actions[0]).toEqual(clearReviewFields());
    });
  });
});
