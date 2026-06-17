export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/booking/index',
    'pages/pets/index',
    'pages/care/index',
    'pages/messages/index',
    'pages/room-detail/index',
    'pages/order-confirm/index',
    'pages/pet-detail/index',
    'pages/log-detail/index',
    'pages/order-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '萌宠寄养',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFF8F0'
  },
  tabBar: {
    color: '#9E9E9E',
    selectedColor: '#FF8C42',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/booking/index',
        text: '预约'
      },
      {
        pagePath: 'pages/pets/index',
        text: '宠物'
      },
      {
        pagePath: 'pages/care/index',
        text: '照护'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      }
    ]
  }
})
