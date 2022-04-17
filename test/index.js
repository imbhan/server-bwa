const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs-extra');
const path = require("path");

chai.use(chaiHttp);


describe('API ENDPOINT TESTING', ()=>{
    it ('GET Landing Page', (done) => {
        chai.request(app).get('/api/v1/member/landing-page').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('hero')
            expect(res.body.hero).to.have.all.keys('travelers', 'treasures', 'cities')
            expect(res.body).to.have.property('mostPicked')
            expect(res.body.mostPicked).to.have.an('array')
            expect(res.body).to.have.property('category')
            expect(res.body.category).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('Object')
            done();
        })
    }) 

    it ('GET Detail Page', (done) => {
        chai.request(app).get('/api/v1/member/detail-page/5e96cbe292b97300fc902232').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('_id')
            expect(res.body).to.have.property('title')
            expect(res.body).to.have.property('price')
            expect(res.body).to.have.property('city')
            expect(res.body).to.have.property('isPopular')
            expect(res.body).to.have.property('sumBooking')
            expect(res.body).to.have.property('description')
            expect(res.body).to.have.property('unit')
            expect(res.body).to.have.property('categoryId')
            expect(res.body).to.have.property('imageId')
            expect(res.body.imageId).to.have.an('array')
            expect(res.body).to.have.property('featureId')
            expect(res.body.featureId).to.have.an('array')
            expect(res.body).to.have.property('activityId')
            expect(res.body.activityId).to.have.an('array')
            expect(res.body).to.have.property('bank')
            expect(res.body.bank).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('Object')
            done();
        })
    }) 

    it ('POST Booking Page', (done) => {
        const image = __dirname + '/bukti.jpeg';
        const dateSample = {
            image,
            idItem: '5e96cbe292b97300fc902232', 
            duration: 2, 
            bookingDateStart : '2022-4-9', 
            bookingDateEnd : '2022-4-11', 
            firstName: 'Ihsan', 
            lastName: 'Budi', 
            email : 'ihsan@email.com', 
            phoneNumber: '089123456789', 
            accountHolder : 'IHSAN BUDIONO', 
            bankFrom: 'BNI',
        };
        chai.request(app).post('/api/v1/member/booking-page')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('idItem', dateSample.idItem)
            .field('duration', dateSample.duration)
            .field('bookingDateStart', dateSample.bookingDateStart)
            .field('bookingDateEnd', dateSample.bookingDateEnd)
            .field('firstName', dateSample.firstName)
            .field('lastName', dateSample.lastName)
            .field('email', dateSample.email)
            .field('phoneNumber', dateSample.phoneNumber)
            .field('accountHolder', dateSample.accountHolder)
            .field('bankFrom', dateSample.bankFrom)
            .attach('image', fs.readFileSync(dateSample.image), '/bukti.jpeg')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.have.equal('Success booking')
                expect(res.body).to.have.property('booking')
                expect(res.body.booking).to.have.all.keys('payments', '_id', 'invoice', 'bookingStartDate', 'bookingEndDate', 'total', 'itemId', 'memberId', '__v')
                expect(res.body.booking.payments).to.have.all.keys('proofPayment', 'status', 'bankFrom', 'accountHolder')
                expect(res.body.booking.itemId).to.have.all.keys('_id', 'title', 'price', 'duration')
                console.log(res.body.booking)
                done();
            })
    }) 

    
})