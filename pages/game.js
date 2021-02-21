import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableHighlight, Button, Alert  } from 'react-native'

export default class game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                {image: require('./images/301.jpg'), count: 2},
                {image: require('./images/302.jpg'), count: 2},
                {image: require('./images/303.jpg'), count: 2},
                {image: require('./images/304.jpg'), count: 2},
                {image: require('./images/305.jpg'), count: 2},
                {image: require('./images/306.jpg'), count: 2},
            ],
            cards: [],
            defaultCards: [
                { image: 0, state: 'close', solved: false },
                { image: 0, state: 'close', solved: false },
                { image: 1, state: 'close', solved: false },
                { image: 1, state: 'close', solved: false },
                { image: 2, state: 'close', solved: false },
                { image: 2, state: 'close', solved: false },
                { image: 3, state: 'close', solved: false },
                { image: 3, state: 'close', solved: false },
                { image: 4, state: 'close', solved: false },
                { image: 4, state: 'close', solved: false },
                { image: 5, state: 'close', solved: false },
                { image: 5, state: 'close', solved: false },
            ],
            firstCard: -1,
            wait: false,
            totalSolved: 0
        }

        this.initGame = this.initGame.bind(this)
    }
    render() {
        return (
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    { this.renderCards() }
                </View>
                <Button title="Mulai Lagi" onPress={this.initGame}/>
                <Image source={{uri: 'https://i.pinimg.com/564x/c8/3b/72/c83b723eedb8f4187c3d81b5d239c43c.jpg'}} />
            </ScrollView>
        )
    }
    renderCards () {
        if (this.state.cards) {

            const result = this.state.cards.map((card, index) => {
                console.log(this.state.images[card.image].image)
                if(card.state==='open' ) {
                    return (
                        <TouchableHighlight 
                            key={index} 
                            onPress={() => {this.handleOpen(index)}}>
                            <Image 
                                source={this.state.images[card.image].image} 
                                style={{width: 100, height: 100, margin: 8}}
                                />
                        </TouchableHighlight>
                    )
                } else {
                    return (
                        <TouchableHighlight 
                            key={index} 
                            style={{width: 100, height: 100, margin: 8, backgroundColor: '#eaeaea', 
                                                borderColor: '#d1d1d1', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {this.handleOpen(index)}}
                            >
                            <Text style={{fontSize: 24, color: '#888888'}}>{index+1}</Text>
                        </TouchableHighlight>
                    )
                }
            })

            return result;
        }
    }

    componentDidMount () {
        this.initGame();
    }

    initGame () {
        const self = this
        var imagesTemp = self.state.defaultCards;
        var cards = [];
        var arr = [0,0,1,1,2,2,3,3,4,4,5,5];
        // console.log(arr)
        for(var i=0; i<imagesTemp.length; i++) {
            var number = this.getRandomArbitrary(0,arr.length-1);
            var newCard = { image: arr[number], state: 'close', solved: false }
            cards.push(newCard);
            arr.splice(number,1);
        }

        this.setState({cards: cards})
    }

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    handleOpen (index) {
        if (!this.state.wait && !this.state.cards[index].solved  && (index !== this.state.firstCard) ) {
            const self = this
            var current = this.state.cards;
            current[index].state = 'open'
            
            self.setState({
                cards: current
            }, function () {
                if(self.state.firstCard === -1) {
                    self.setState({
                        firstCard: index
                    })
                } else {
                    this.setState({wait: true})

                    setTimeout( function () {
                        // if match, open both cards
                        console.log(self.state.cards[self.state.firstCard])
                        console.log(self.state.cards[index])
                        if (self.state.cards[index].image === self.state.cards[self.state.firstCard].image) {
                            current[index].solved = true
                            current[self.state.firstCard].solved = true

                            self.setState({
                                cards: current,
                                firstCard: -1,
                                wait: false,
                                totalSolved: self.state.totalSolved+1
                            }, function () {
                                var isWin = this.checkWin()
                                if (isWin) {
                                    Alert.alert('yeay menang elu')
                                }
                            })
                        } else { // if not match, close both cards
                            current[index].state = 'close'
                            current[self.state.firstCard].state = 'close'

                            self.setState({
                                cards: current,
                                firstCard: -1,
                                wait: false
                            })
                        }
                    }, 1000)
                }
            })
        }
    }
    
    checkWin() {
        const isWin = this.state.images.length === this.state.totalSolved;
        if(isWin) {console.log('wiiiin')}
        return isWin
    }
}
