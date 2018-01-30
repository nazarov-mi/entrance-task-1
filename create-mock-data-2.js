const { models, sequelize } = require('./models');

function rand(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min
}

function createData () {
  let usersPromise = models.User.bulkCreate([
    'Квасов Филипп',
    'Собачкин Никита',
    'Ляпушкин Емельян',
    'Борков Марк',
    'Мартынов Ефим',
    'Калитин Онисим',
    'Галыгин Моисей',
    'Квасницкий Адриан',
    'Чюличков Даниил',
    'Ямлиханов Всеволод',
    'Нусуев Вениамин',
    'Кораблёв Клавдий',
    'Панькив Валентин',
    'Горбачев Варфоломей',
    'Кодица Ярослав',
    'Чернышёв Ираклий',
    'Шайнюк Ким',
    'Есаулов Михей',
    'Тимошкин Радион',
    'Елышев Потап'
  ]
    .map(el => ({
      login: el,
      avatarUrl: 'https://picsum.photos/32/32/?random=' + rand(150, 300),
      homeFloor: rand(1, 5)
    }))
  );

  let roomsPromise = models.Room.bulkCreate([
    'Мандрагора',
    'Гвоздика',
    'Астра',
    'Полынь',
    'Рябина',
    'Розмарин'
  ]
    .map(el => ({
      title: el,
      capacity: rand(4, 5),
      floor: rand(1, 5)
    }))
  );

  let last = new Date()
  let from, to

  last.setHours(8, 0, 0, 0)

  let eventsPromise = models.Event.bulkCreate([
    'Далеко-далеко за словесными горами',
    'В стране, гласных и согласных',
    'Живут рыбные тексты',
    'Путь журчит, парадигматическая всеми',
    'Коварный единственное семантика возвращайся',
    'Это снова, букв ее, подпоясал переписали',
    'Злых встретил бросил жаренные, они пояс',
    'Текст родного, лучше, вскоре',
    'Переписывается образ алфавит',
    'Продолжил букв, свой гор подпоясал',
    'Маленький необходимыми жаренные',
    'Взгляд то безопасную всеми ручеек',
    'Мир, но языкового',
    'Себя города страна',
    'Имени деревни взобравшись его'
  ]
    .map(el => {
      from = last
      to = new Date(from)

      to.setHours(to.getHours() + rand(1, 2))

      last = to

      return {
        title: el,
        dateStart: from,
        dateEnd: to
      }
    })
  );

  Promise.all([usersPromise, roomsPromise, eventsPromise])
    .then(() => Promise.all([
      models.User.findAll(),
      models.Room.findAll(),
      models.Event.findAll()
    ]))
    .then(function ([users, rooms, events]) {
      let promises = [];

      events.forEach(el => {
        const currentUsers = []
        const num = rand(2, 4)

        while (currentUsers.length < num) {
          const user = users[rand(0, users.length - 1)]

          if (currentUsers.indexOf(user) < 0) {
            currentUsers.push(user)
          }
        }

        const currentRoom = rooms[rand(0, rooms.length - 1)]

        promises.push(
          el.setRoom(currentRoom),
          el.setUsers(currentUsers)
        )
      })

      return Promise.all(promises);
    })
}

sequelize.sync()
  .then(createData);
