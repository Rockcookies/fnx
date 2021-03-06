var Class = require('../class');

describe('Class', function() {

  it('Class.create(parent)', function() {
    function Animal(name) {
      this.name = name
    }

    Animal.prototype.getName = function() {
      return this.name
    }

    var Dog = Class.create(Animal)
    var dog = new Dog('Jack')

    expect(dog.constructor).toEqual(Dog)
    expect(dog.name).toEqual('Jack')
    expect(dog.getName()).toEqual('Jack')
  })

  it('Class.create(null)', function() {
    var Dog = Class.create(null)
    var dog = new Dog()
    expect(dog.constructor).toEqual(Dog)
    expect(Dog.superclass.constructor).toEqual(Class)

    Dog = Class.create()
    new Dog()
    expect(Dog.superclass.constructor).toEqual(Class)
  })

  it('Class.create(parent, properties)', function() {
    function Animal(name) {
      this.name = name
    }

    Animal.prototype.getName = function() {
      return this.name
    }

    var Dog = Class.create(Animal, {
      talk: function() {
        return 'I am ' + this.name
      }
    })
    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(dog.talk()).toEqual('I am Jack')
  })

  it('call initialize method properly', function() {
    var counter = 0

    var Animal = Class.create({
      initialize: function() {
        counter++
      }
    })

    var Dog = Class.create(Animal, {
      initialize: function() {
        counter++
      }
    })

    new Dog()

    // Dog 有 initialize 时，只调用 Dog 的 initialize
    expect(counter).toEqual(1)

    counter = 0
    Dog = Class.create(Animal)

    new Dog()

    // Dog 没有 initialize 时，会自动调用父类中最近的 initialize
    expect(counter).toEqual(1)
  })

  it('pass arguments to initialize method properly', function() {

    var Animal = Class.create({
      initialize: function(firstName, lastName) {
        this.fullName = firstName + ' ' + lastName
      }
    })

    var Bird = Animal.extend({
      fly: function() {
      }
    })

    var bird = new Bird('Frank', 'Wang')

    expect(bird.fullName).toEqual('Frank Wang')
  })

  it('superclass', function() {
    var counter = 0

    var Animal = Class.create({
      initialize: function() {
        counter++
      },
      talk: function() {
        return 'I am an animal'
      }
    })

    var Dog = Class.create(Animal, {
      initialize: function() {
        Dog.superclass.initialize()
      },
      talk: function() {
        return Dog.superclass.talk()
      }
    })

    var dog = new Dog()

    expect(counter).toEqual(1)
    expect(dog.talk()).toEqual('I am an animal')
  })

  it('Extends', function() {
    function Animal(name) {
      this.name = name
    }

    Animal.prototype.getName = function() {
      return this.name
    }

    var Dog = Class.create({
      Extends: Animal,
      talk: function() {
        return 'I am ' + this.name
      }
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(dog.getName()).toEqual('Jack')
    expect(dog.talk()).toEqual('I am Jack')
  })

  it('Implements', function() {
    var Animal = Class.create(function(name) {
      this.name = name
    }, {
      getName: function() {
        return this.name
      }

    })

    var Flyable = {
      fly: function() {
        return 'I am flying'
      }
    }

    var Talkable = function() {
    }
    Talkable.prototype.talk = function() {
      return 'I am ' + this.name
    }

    var Dog = Class.create({
      Extends: Animal,
      Implements: [Flyable, Talkable]
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(dog.getName()).toEqual('Jack')
    expect(dog.fly()).toEqual('I am flying')
    expect(dog.talk()).toEqual('I am Jack')
  })

  it('Statics', function() {
    var Dog = Class.create({
      initialize: function(name) {
        this.name = name
      },
      Statics: {
        COLOR: 'red'
      }
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(Dog.COLOR).toEqual('red')
  })

  it('statics inherited from parent', function() {
    var Animal = Class.create()
    Animal.LEGS = 4

    var Dog = Class.create({
      Extends: Animal,

      Statics: {
        COLOR: 'red'
      },

      initialize: function(name) {
        this.name = name
      }
    })

    expect(Dog.LEGS).toEqual(4)
    expect(Dog.COLOR).toEqual('red')

    var Pig = Class.create(Class)

    expect(typeof Pig.implement).toEqual('function')
    expect(typeof Pig.extend).toEqual('function')
    expect(typeof Pig.Mutators).toEqual('undefined')
    expect(typeof Pig.create).toEqual('undefined')
  })

  it('Class.extend', function() {
    var Dog = Class.extend({
      initialize: function(name) {
        this.name = name
      }
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(Dog.superclass.constructor).toEqual(Class)
  })

  it('SubClass.extend', function() {
    var Animal = Class.create(function(name) {
      this.name = name
    })

    var Dog = Animal.extend()
    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(Dog.superclass.constructor).toEqual(Animal)
  })

  it('SubClass.implement', function() {
    var Animal = Class.create(function(name) {
      this.name = name
    })

    var Dog = Animal.extend()
    Dog.implement({
      talk: function() {
        return 'I am ' + this.name
      }
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(dog.talk()).toEqual('I am Jack')
    expect(Dog.superclass.constructor).toEqual(Animal)
  })

  it('convert existed function to Class', function() {
    function Dog(name) {
      this.name = name
    }

    Class(Dog).implement({
      getName: function() {
        return this.name
      }
    })

    var dog = new Dog('Jack')

    expect(dog.name).toEqual('Jack')
    expect(dog.getName()).toEqual('Jack')

    var MyDog = Dog.extend({
      talk: function() {
        return 'I am ' + this.name
      }
    })

    var myDog = new MyDog('Frank')
    expect(myDog.name).toEqual('Frank')
  })

  it('new AnotherClass() in initialize', function() {
    var called = []

    var Animal = Class.create({
      initialize: function() {
        called.push('Animal')
      }
    })

    var Pig = Class.create(Animal, {
      initialize: function() {
        called.push('Pig')
      }
    })

    var Dog = Class.create(Animal, {
      initialize: function() {
        new Pig()
        called.push('Dog')
      }
    })

    new Dog()
    expect(called.join(' ')).toEqual('Pig Dog')

  })

  it('StaticsWhiteList', function() {

    var A = Class.create()
    A.a = 1
    A.b = 1
    A.StaticsWhiteList = ['a']
    var B = A.extend(A)

    expect(B.a).toEqual(1)
    expect(B.b).toEqual(undefined)
    expect(B.StaticsWhiteList).toEqual(undefined)

  })

  it('Meta information', function() {

    var Dog = require('./data/dog')
    var dog = new Dog()
    //seajs.log(dog, 'dir')

    expect(dog.isAnimal).toEqual(true)
    expect(dog.isDog).toEqual(true)
  })

})