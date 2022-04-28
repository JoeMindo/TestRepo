const grades = {
  1: 'Grade A',
  2: 'Grade B',
  3: 'Grade C',
  4: 'Grade D',
  5: 'Grade E',
};

export const strings = {
  registration: {
    en: 'Welcome to Mamlaka Foods\n',
    sw: 'Karibu Mamlaka Foods\n',
  },
  firstname: {
    en: 'Enter your first name\n',
    sw: 'Weka jina lako la kwanza\n',
  },
  lastname: {
    en: 'Enter your last name\n',
    sw: 'Weka jina lako la mwisho\n',
  },
  idNumber: {
    en: 'Enter your ID number\n',
    sw: 'Weka namba ya kitambulisho\n',
  },
  gender: {
    en: 'What is the gender\n1. Male\n2. Female',
    sw: 'Jinsia yako ni gani\n1. Mwanaume\n2. Mwanamke',
  },
  noOrders: {
    en: 'No Orders found',
    sw: 'Hakuna Maagizo yaliyopatikana',
  },
  password: {
    en: 'Enter your password',
    sw: 'Weka nenosiri lako',
  },
  confirmPassword: {
    en: 'Confirm your password',
    sw: 'Thibitisha nenosiri lako',
  },
  role: {
    en: 'What is your role\n1. Farmer\n2. Buyer',
    sw: 'Jukumu lako ni nini\n1. Mkulima\n2. Mnunuzi',
  },
  successFarmer: {
    en: 'Welcome, you have registered as a farmer',
    sw: 'Karibu, umejisajili kama mkulima',
  },
  successBuyer: {
    en: 'Welcome, you have registered as a buyer',
    sw: 'Karibu, umejisajili kama mnunuzi',
  },
  couldNotAssignRole: {
    en: 'Could not assign you a role, please register again',
    sw: 'Haikuweza kukupa jukumu, tafadhali jiandikishe tena',
  },
  updateLocation: {
    en: '1. Update Location\n',
    sw: '1. Sasisha Mahali\n',
  },
  addFarmDetails: {
    en: '2. Add Farm Details\n',
    sw: '2. Ongeza Maelezo ya Shamba\n',
  },
  addProduct: {
    en: '3. Add product to farm\n',
    sw: '3. Ongeza bidhaa shambani\n',
  },
  updateDetails: {
    en: '4. Update farmer details\n',
    sw: '4. Sasisha maelezo ya mkulima\n',
  },
  updateListedProduce: {
    en: '5. Update listed produce\n',
    sw: '5. Sasisha bidhaa zilizoorodheshwa\n',
  },
  joinGroup: {
    en: '6. Join Group\n',
    sw: '6. Jiunge na Kikundi\n',
  },
  myFarms: {
    en: '7. My Farms',
    sw: '7. Mashamba yangu',
  },
  addFarmLocationOption: {
    en: 'Where would you like to add your farm?\n1.Registred Location\n2.Other location',
    sw: 'Je, ungependa kuongeza shamba lako wapi?\n1.Mahali paliposajiliwa\n2.Eneo lingine',
  },
  noProduce: {
    en: 'You have no produce listed',
    sw: 'Huna mazao yaliyoorodheshwa',
  },
  enterFarmName: {
    en: 'Enter farm name',
    sw: 'Ingiza jina la shamba',
  },
  farmArea: {
    en: 'Which area is your farm in?\n',
    sw: 'Shamba lako liko eneo gani?\n',
  },
  categoryOfFoodsGrown: {
    en: 'Choose a category of foods that you grow\n',
    sw: 'Chagua aina ya vyakula unavyolima\n',
  },
  productGrown: {
    en: 'Choose a product that you grow\n',
    sw: 'Chagua bidhaa unayokuza\n',
  },
  farmSize: {
    en: 'What is the farm size',
    sw: 'Shamba hilo lina ukubwa gani',
  },
  registerFarmSuccess: {
    en: 'Farm registered successfully',
    sw: 'Shamba limesajiliwa kwa mafanikio',
  },
  registerFarmFail: {
    en: 'Farm registration failed',
    sw: 'Shamba haikufaulu kusajili',
  },
  askForProduceVariety: {
    en: 'What is the variety of produce that you grow',
    sw: 'Ni aina gani ya mazao unayolima',
  },
  askForQuantityPerHarvest: {
    en: 'What quantity do you have per harvest',
    sw: 'Una magunia ngapi ya mazao kwa mavuno',
  },
  totalFarmSizeOwned: {
    en: 'What is the total farm size owned by you in acres',
    sw: 'Je, shamba lako lina ukubwa wa kiasi gani katika ekari',
  },
  kraPin: {
    en: 'What is your KRA PIN?',
    sw: 'PIN yako ya KRA ni nini?',
  },
  equipmentOwned: {
    en: 'What sort of equipment do you own',
    sw: 'Unamiliki vifaa vya aina gani',
  },
  produceReturnLevels: {
    sw: 'Je, viwango vyako vya kurudi kwa mazao ni vipi?',
    en: 'What is your produce return levels?',
  },
  landOwnershipStatus: {
    en: 'Do you own land (Yes/No)',
    sw: 'Je, unamiliki ardhi (Ndiyo/Hapana)',
  },
  businessOwnershipStatus: {
    en: 'Do you have a business?(Yes/No)',
    sw: 'Je, una biashara? (Ndiyo/Hapana)',
  },
  groupMembershipStatus: {
    en: 'Are you a part of any group?',
    sw: 'Je, wewe ni sehemu ya kundi lolote?',
  },
  totalProductionCost: {
    sw: 'Je, jumla ya gharama yako ya uzalishaji ni kiasi gani kwa msimu?',
    en: 'What is your total production cost per season?',
  },
  successfulDetailUpdate: {
    en: 'Farmer details updated successfully',
    sw: 'Maelezo ya mkulima yalisasishwa kwa mafanikio',
  },
  requestQuantity: {
    en: 'Enter the quantity of ',
    sw: 'Ingiza wingi wa',
  },
  askForGrade: {
    en: `How would you grade your produce?\n1.${grades[1]}\n2.${grades[2]}\n3.${grades[3]}\n4. ${grades[4]}\n5. ${grades[5]}`,
    sw: `Je, ungepangaje bidhaa zako?\n1.${grades[1]}\n2.${grades[2]}\n3.${grades[3]}\n4. ${grades[4]}\n5. ${grades[5]}`,
  },
  productAddedSuccessfully: {
    en: 'Product added successfully',
    sw: 'Bidhaa imeongezwa kwa mafanikio',
  },
  productAddedFailure: {
    en: 'Could not add product',
    sw: 'Haikuweza kuongeza bidhaa',
  },
  selectRegion: {
    en: 'Select region\n',
    sw: 'Chagua eneo\n',
  },
  selectCounty: {
    en: 'Select county\n',
    sw: 'Chagua kaunti\n',
  },
  selectSubCounty: {
    en: 'Select subcounty\n',
    sw: 'Chagua kata ndogo\n',
  },
  selectLocation: {
    en: 'Select location\n',
    sw: 'Chagua eneo\n',
  },
  area: {
    en: 'What is your area',
    sw: 'Uko eneo gani',
  },
  locationUpdateOk: {
    en: 'Location Updated',
    sw: 'Eneo Limesasishwa',
  },
  locationUpdateFailed: {
    en: 'Could not update location',
    sw: 'Haikuweza kusasisha eneo',
  },
  noLocation: {
    en: 'Update your location first',
    sw: 'Sasisha eneo lako kwanza',
  },
  errorMessage: {
    en: 'Error!',
    sw: 'Hitilafu!',
  },
  footer: {
    en: '\n 00. Back 0.Home',
    sw: '\n 00. Nyuma 0.Nyumbani',
  },
  viewCart: {
    en: '\n67. View cart',
    sw: '\n67. Tazama bidhaa ulizochagua',
  },
  viewFarms: {
    en: 'Choose a farm to view\n',
    sw: 'Chagua shamba ili kuona\n',
  },

  more: {
    en: '\n98.More',
    sw: '\n98.Zaidi',
  },
  submitDetails: {
    en: 'Submit details?\n 1.Yes',
    sw: 'Ungependa kutuma maelezo?\n 1.Ndiyo',
  },
  viewProducts: {
    en: '1. View available products',
    sw: '1. Angalia bidhaa zinazopatikana',
  },
  myCart: {
    en: '2. My cart',
    sw: '2. Mkokoteni wangu',
  },
  myOrders: {
    en: '3. My orders',
    sw: '3. Maagizo yangu',
  },
  groupOrder: {
    en: '4. Group order\n',
    sw: '4. Agizo la kikundi\n',
  },
  createGroup: {
    en: '1. Create Group\n',
    sw: '1. Unda Kikundi\n',
  },
  groupToJoin: {
    en: '1. What group would you like to buy from?\n',
    sw: '1. Je! ungependa kununua kutoka kwa kikundi gani?\n',
  },
  groupName: {
    en: '1. What is the name of your group?\n',
    sw: '1. Je! jina la kikundi yako ni?\n',
  },
  centerForPicking: {
    en: 'Choose a place where you will pick your goods\n',
    sw: 'Chagua mahali ambapo utachagua bidhaa zako\n',
  },
  askForNumber: {
    en: 'Checkout using\n 1. This Number\n ',
    sw: 'Lipa kwa kutumia\n 1. Nambari Hii\n',
  },
  quantityToBuy: {
    en: 'Enter the quantity you want to buy\n',
    sw: 'Ingiza kiasi unachotaka kununua\n',
  },
  successfullyAddItemsTocart: {
    en: 'Successfully added items to cart\n 1. Checkout\n 67. View Cart',
    sw: 'Imeongeza vipengee kwenye rukwama\n 1. Lipa\n 67. Angalia Rukwama',
  },
  noItemsAddedToCart: {
    en: 'You have not selected any item to add to cart',
    sw: 'Hujachagua kipengee chochote cha kuongeza kwenye rukwama',
  },
  cartItemsUpdatedSuccessfully: {
    en: 'Cart items updated successfully\n 1. Checkout\n',
    sw: 'Vipengee vya rukwama vimesasishwa kwa ufanisi\n 1. Lipa\n',
  },
  noItemSelectedToUpdate: {
    en: 'You have not selected an item to update',
    sw: 'Hujachagua kipengee cha kusasisha',
  },
  askForItemToUpdate: {
    en: 'Select the item to update\n',
    sw: 'Chagua kipengee cha kusasisha\n',
  },
  askForItemToRemove: {
    en: 'Select the item to remove\n',
    sw: 'Chagua kipengee cha kuondoa\n',
  },

  itemRemovedSuccessfully: {
    en: 'Item removed successfully\n 67. View cart\n',
    sw: 'Kipengee kimeondolewa\n 67. Tazama rukwama\n',
  },
  itemNotFound: {
    en: 'Item not found\n',
    sw: 'Kipengee hakijapatikana\n',
  },
  updatedSuccessfully: {
    en: 'Updated successfully\n',
    sw: 'Imesasishwa kwa ufanisi\n',
  },
  updatedQuantityToBuy: {
    en: 'What is the quantity you want?\n',
    sw: 'Unataka kiasi gani?\n',
  },
  paymentPrompt: {
    en: 'Proceed to pay KES',
    sw: 'Endelea kulipa KES',
  },
  yourCartItems: {
    en: 'Your cart items are \n',
    sw: 'Vitu vyako vya rukwama ni \n',
  },
  checkoutAndUpdate: {
    en: '1. Checkout\n 2. Update Cart',
    sw: '1. Malipo\n 2. Sasisha Rukwama',
  },
  noItemsInCart: {
    en: 'Your cart is empty',
    sw: 'Rukwama yako ni tupu',
  },
  operation: {
    en: 'Choose an operation\n 1. Remove Item\n 2. Change Item quantity',
    sw: 'Chagua operesheni\n 1. Ondoa Kipengee\n 2. Badilisha wingi wa Kipengee',
  },
  addToCart: {
    en: '1. Add to cart',
    sw: '1. Ongeza kwenye rukwama',
  },
  language: {
    en: 'Choose language\n1. English\n2. Kiswahili',
    sw: 'Chagua lugha\n1. Kiingereza\n2. Kiswahili',
  },
  from: {
    en: 'From',
    sw: 'Kutoka',
  },
  yes: {
    en: '1. Yes',
    sw: '1. Ndiyo',
  },
  grade: {
    en: 'grade:',
    sw: 'kalasa:',
  },
  atKES: {
    en: 'at KES',
    sw: 'KES',
  },
  total: {
    en: 'Total',
    sw: 'Jumla',
  },
  category: {
    en: 'Choose a category',
    sw: 'Chagua kategoria',
  },
  product: {
    en: 'Choose a product\n',
    sw: 'Chagua bidhaa\n',
  },
  kycsection: {
    en: 'Choose a section to fill',
    sw: 'Chagua sehemu ya kujaza',
  },
  kycmetrics: {
    en: 'Choose a question to answer',
    sw: 'Chagua swali la kujibu',
  },
  somethingWentWrong: {
    en: 'Something went wrong, try again later',
    sw: 'Kuna hitilafu, jaribu tena baadae',
  },
  serverError: {
    en: 'Sever error, please try later',
    sw: 'Hitilafu ya seva, jaribu tena baadae',
  },
  buy: {
    en: 'Buy',
    sw: 'nunua',
  },
  dataNotFound: {
    en: 'Data not found',
    sw: 'Data hakijapatikana',
  },
  outOfRange: {
    en: 'Invalid input. Please enter a number within the range.',
    sw: 'Ingizo batili. Tafadhali ingiza nambari ndani ya safu.',
  },
  orderSuccess: {
    en: 'Order successful',
    sw: 'Agizo limefaulu',
  },
  orderFailed: {
    en: 'Order failed',
    sw: 'Agizo limeshindwa',
  },

  invalidInput: {
    en: 'Invalid input, try again',
    sw: 'Ingizo batili, jaribu tena',
  },
  proceed: {
    en: 'Proceed?\n 1. Yes',
    sw: 'Endelea?\n 1. Ndiyo',
  },
  chooseOffering: {
    en: 'Choose an offering\n',
    sw: 'Chagua toleo\n',
  },
  noProductsInFarm: {
    en: 'There are no products in this farm',
    sw: 'Hakuna bidhaa katika shamba hili',
  },
  listedProduce: {
    en: 'Here are the listed produce in your farm.\n',
    sw: 'Haya ndiyo mazao yaliyoorodheshwa katika shamba lako.\n',
  },
  noFarm: {
    en: 'You have not added any farm yet',
    sw: 'Bado hujaongeza shamba lolote',
  },
  requestGroupName: {
    en: 'What is the name of your group\n',
    sw: 'Jina la kikundi chako ni nini\n',
  },
  groupCreatedSuccess: {
    en: 'Group added successfully\n 1. Add items to buy',
    sw: 'Kikundi kimeongezwa kwa mafanikio\n 1. Ongeza bidhaa za kununua',
  },
  couldNotCreateGroup: {
    en: 'Could not create group, try again\n',
    sw: 'Haikuweza kuunda kikundi, jaribu tena\n',
  },
  orderId: {
    en: 'Order ID: ',
    sw: 'Kitambulisho cha agizo:',
  },
  status: {
    en: 'Status: ',
    sw: 'Hali: ',
  },

  makePayment: {
    en: 'Make payment here',
    sw: 'Lipa hapa',
  },
  differentNumber: {
    en: 'Enter phone number to checkout with',
    sw: 'Ingiza nambari ya simu ya kulipa nayo',
  },
  unitsAvailable: {
    en: 'Available units',
    sw: 'Vitengo vinavyopatikana',
  },
  gradeOfItems: {
    en: 'grade of items:',
    sw: 'daraja la vitu:',
  },
  amountIsHigher: {
    en: 'The amount you set is higher than the available units go back and choose a smaller quantity',
    sw: 'Kiasi ulichoweka ni kikubwa kuliko vipimo vinavyopatikana rudi nyuma na uchague kiasi kidogo',
  },
  chooseProduct: {
    en: 'Choose a product to buy\n',
    sw: 'Chagua bidhaa ya kununua\n',
  },
  couldNotFetch: {
    en: 'Could not fetch products, try again later',
    sw: 'Haikuweza kupata bidhaa, jaribu tena baadae',
  },
  chooseOneToBuy: {
    en: 'Choose one of the available options to buy.',
    sw: 'Chagua moja kutoka kwenye vipimo vinavyopatikana.',
  },
  selectCategory: {
    en: 'Select a category\n',
    sw: 'Chagua kategoria\n',
  },
  couldNotFetchCategories: {
    en: 'Could not fetch categories, try again later',
    sw: 'Haikuweza kuleta kategoria, jaribu tena baadaye',
  },
  askForOptionSelection: {
    en: 'Choose an option to buy',
    sw: 'Chagua chaguo la kununua',
  },
  productNotAvailable: {
    en: 'This product is not available',
    sw: 'Hii bidhaa hakipatikani',
  },
  selectPrice: {
    en: 'Select the price you want to buy at\n 1. Unit Price\n 2. Group price \n',
    sw: 'Chagua bei unayotaka kununua\n 1. Bei ya Jumla\n 2. Bei ya kikundi \n',
  },
  buyAtUnit: {
    en: 'Buy item at unit price 1. Yes \n',
    sw: 'Nunua bidhaa kwa bei ya kitengo 1. Ndiyo \n',
  },
  buyAtGroup: {
    en: 'Buy item at group price 1. Yes\n',
    sw: 'Nunua bidhaa kwa bei ya kikundi 1. Ndiyo\n',
  },
  selectAResponse: {
    en: 'Select any of the following separated by a space',
    sw: 'Chagua yoyote kati ya yafuatayo yaliyotenganishwa na nafasi',
  },
  answerNotAvailable: {
    en: 'Could not fetch answers at the moment, try later',
    sw: 'Haikuweza kupata majibu kwa sasa, jaribu tena baadaye',
  },
  typeAnswer: {
    en: 'Type in your answer',
    sw: 'Andika jibu lako',
  },
  kycSuccess: {
    en: 'Thank you for your submission',
    sw: 'Asante kwa kutuma ujumbe wako',
  },
  kycFailure: {
    en: 'Could not submit answers, try again later',
    sw: 'Haikuweza kuwasilisha majibu, jaribu tena baadaye',
  },
  chooseFarm: {
    en: 'Choose a farm to add product to\n',
    sw: 'Chagua shamba la kuongeza bidhaa\n',
  },
  productToAdd: {
    en: 'Select a product you want to add to your farm\n',
    sw: 'Chagua bidhaa unayotaka kuongeza katika shamba yako\n',
  },
  quantityOfHarvest: {
    en: 'How many of bags do you expect to harvest?\n',
    sw: 'Unatarajia kuvuna magunia ngapi?\n',
  },
  produceSuccess: {
    en: 'Produce added successfully',
    sw: 'Bidhaa kimeongezwa kwa mafanikio',
  },
  chooseFarmToUpdateProduce: {
    en: 'Choose a farm to update produce\n',
    sw: 'Chagua shamba la kusasisha mazao\n',
  },
  farmNotFound: {
    en: 'Please register a farm first',
    sw: 'Tafadhali sajili shamba kwanza',
  },
  actionToTake: {
    en: 'What would you like to do?\n ',
    sw: 'Ungependa kufanya nini?\n',
  },
  updateQuantity: {
    en: '1. Update quantity\n',
    sw: '1. Sasisha wingi\n',
  },
  listForSale: {
    en: '2. Sell Produce\n',
    sw: '2. Uza Bidhaa\n',
  },
  chooseProduceToUpdateQuantity: {
    en: 'What produce do you want to update the quantity\n',
    sw: 'Unataka kusasisha bidhaa gani\n',
  },
  itemToSell: {
    en: 'What produce do you sell',
    sw: 'Unauza mazao gani',
  },
  itemQuantity: {
    en: 'What is the new quantity?\n',
    sw: 'Ni kiasi gani kipya?\n',
  },
  bagsForSale: {
    en: 'What is the quantity for sale?\n',
    sw: 'Mifuko gani inauzwa?\n',
  },
  successfullUpdate: {
    en: 'Updated successfully',
    sw: 'Imesasishwa kwa mafanikio',
  },
  updateFailed: {
    en: 'Failed to update',
    sw: 'Haikuweza kusasisha',
  },
  forSaleSuccess: {
    en: 'Produce is now available for sale',
    sw: 'Bidhaa sasa inapatikana kwa mauzo',
  },
  forSaleFailure: {
    en: 'Could not list for sale',
    sw: 'Haikuweza kuorodheshwa kwa kuuza',
  },
  userNameTooShort: {
    en: 'Username must be at least 3 characters',
    sw: 'Jina la mtumiaji lazima liwe na angalau vibambo 3',
  },
  usernameOnlyLetters: {
    en: 'Username must be letters only',
    sw: 'Jina la mtumiaji lazima liwe herufi pekee',
  },
  valid: {
    en: 'valid',
    sw: 'valid',
  },
  noGroups: {
    en: 'No groups found',
    sw: 'Hakuna vikundi zilizopatikana',
  },
  chooseGroupToJoin: {
    en: 'Choose a group to join\n',
    sw: 'Chagua kikundi cha kuunga\n',
  },

  idTooShort: {
    en: 'ID number must be at least 8 characters',
    sw: 'Nambari ya kitambulisho lazima iwe angalau vibambo 8',
  },
  idOnlyNumbers: {
    en: 'ID number must be numbers only',
    sw: 'Nambari ya kitambulisho lazima iwe nambari pekee',
  },
  chooseListedOptions: {
    en: 'Choose option only the listed options',
    sw: 'Chagua chaguo tu chaguo zilizoorodheshwa',
  },
  english: {
    en: 'English',
    sw: 'Kiingereza',
  },
  kiswahili: {
    en: 'Kiswahili',
    sw: 'Kiswahili',
  },
  changeLocationDetails: {
    en: '8.Change location details',
    sw: '8.Badilisha maelezo ya eneo',
  },
  updateLocationDetailsSuccess: {
    en: 'Location details updated successfully',
    sw: 'Maelezo ya eneo imesasishwa kwa mafanikio',
  },
  farmSizeMetrics: {
    en: 'What metric do you use to measure farm size?\n',
    sw: 'Nini unatumia kuweka maelezo ya ukubwa wa shamba?\n',
  },
  farmAddProductMetrics: {
    en: 'What metric do you use to package your harvest?\n',
    sw: 'Nini unatumia kuweka maelezo ya kifungo cha ukombozi?\n',
  },
  noMetricsFound: {
    en: 'No metrics found',
    sw: 'Hakuna maelezo zilizopatikana',
  },
  nothingToSee: {
    en: 'Nothing to see here',
    sw: 'Nothing to see here',
  },
  shippingDetails: {
    en: '4. Shipping details',
    sw: '4. Maelezo ya kusafirisha',
  },
  newShippingDetails: {
    en: '1. Enter new shipping details',
    sw: '1. Ingiza maelezo mpya ya kusafirisha',
  },
  viewShippingAddresses: {
    en: '2. View Shipping addresses',
    sw: '2. Angalia anwani za kusafirisha',
  },
  inputCity: {
    en: 'Enter city',
    sw: 'Ingiza mji',
  },
  inputLandmark: {
    en: 'Enter landmark',
    sw: 'Ingiza alama',
  },
  isHome: {
    en: 'Is this your home?\n 1. Yes\n 2. No\n',
    sw: 'Ndio hii ni mji yako?\n 1. Ndio\n 2. La\n',

  },
  isBilling: {
    en: 'Is this your billing address?\n 1. Yes\n 2. No\n',
    sw: 'Ndio hii ni anwani ya kusafirisha yako\n 1. Ndio\n 2. La\n',
  },
  isPrimary: {
    en: 'Use this address as the primary address?\n 1. Yes\n 2. No\n',
    sw: 'Tumia anwani hii kama anwani ya kuu\n 1. Ndio\n 2. La\n',
  },
  confirmShippingDetails: {
    en: 'Confirm shipping details\n 1. Yes\n 2. No\n',
    sw: 'Thibitisha maelezo ya kusafirisha\n 1. Ndio\n 2. La\n',
  },
  shippingAddressCreated: {
    en: 'Shipping address created successfully',
    sw: 'Anwani ya kusafirisha imetengenezwa kwa mafanikio',
  },
  shippingAddressNotCreated: {
    en: 'Shipping address not created',
    sw: 'Anwani ya kusafirisha haikujatengenezwa',
  },
  noAddressFound: {
    en: 'No address found',
    sw: 'Hakuna anwani zilizopatikana',
  },

};
export default strings;
