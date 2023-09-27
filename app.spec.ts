import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"

describe('App', () => {
    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', () => {
      const app = new App();
        const bikeId = "unregisteredBikeId"; // Um ID que não está registrado no app
        const newYork = new Location(40.753056, -73.983056);

        return expect(() => app.moveBikeTo(bikeId, newYork)).toThrowError('Bike not found.');
    })
})

it('should throw rent not found error when rent is not found', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        expect(() => {
            app.returnBike(bike.id!, user.email)
        }).toThrow(RentNotFoundError)
    })

    it('should throw duplicated user error when trying to register an existing user', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        const duplicateUser = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        expect(async () => {
            await app.registerUser(duplicateUser)
        }).toThrow(DuplicateUserError)
    })
