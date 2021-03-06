/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import client from '../../server.js';
import {addLocation, isLocationPresent} from '../../core/usermanagement.js';
import {retreiveCachedItems, setToCache} from '../../core/services.js';
import {
    fetchCategories,
    fetchProducts,
    addProduct,
    productsInFarm,
    updateListedProduct,
    listProductForSale,
    getProductQuantityMetrics
} from '../../products/productmanagement.js';
import {
    addFarm,
    addFarmerKYC,
    getAnswersPerQuestion,
    getFarmerMetricSections,
    getQuestionsPerSection,
    getUserFarms,
    showGroups,
    joinGroup,
    renderFarmerFarms,
    inputFarmLocation,
    renderProductsInFarm,
    getFarmSizeMetrics
} from './farmmanagement.js';

import {responsePrompt} from '../../menus/prompts.js';
import {changeUserLocation, promptToGive} from './farmerlocation.js';
import {renderFarmerMenusLevelTwo, renderLocationOptions} from '../../menus/rendermenu.js';
import {numberWithinRange} from '../../helpers.js';

const con = () => 'CON';
const end = () => 'END';
export const isTextOnly = (str) => /^[a-zA-Z]+$/.test(str);

const questionanswers = {};
/**
 * It takes in a farm ID and returns a list of products in that farm
 * @param farmID - The ID of the farm that you want to see the products in.
 * @returns A string of all the products in the farm.
 */
export const showProductsInFarm = async (farmID, menus, idsArray) => {
    const products = await productsInFarm(farmID);

    const productIDs = [];
    let productList = '';
    if (products.data.status === 'success') {
        products.data.message.forEach((product, index) => {
            const combination = {
                id: product.id,
                prodID: product.product_id
            };
            productIDs.push(combination);
            idsArray.push(product.id);
            client.set('productIDs', JSON.stringify(productIDs));

            productList += `\n${
                (index += 1)
            }. ${
                product.product_name
            }`;
        });
        return {productList, idsArray};
    }
    return `${
        menus.noProductsInFarm
    }`;
};

/**
 * This function is used to update the user's location.
 */
export const renderUpdateLocationMenu = async (textValue, text, menus) => {
    let message;
    if (textValue === 2) {
        const menuPrompt = await promptToGive(client, 'region', menus);
        message = menuPrompt;
    } else if (textValue === 3) {
        const validRange = numberWithinRange(text, 2, menus);
        if (validRange === 'valid') {
            const regionId = parseInt(text.split('*')[2], 10);
            const menuPrompt = await promptToGive(client, 'county', menus, regionId);
            message = menuPrompt;
        } else {
            message = `${
                end()
            } ${
                menus.outOfRange
            }`;
        }
    } else if (textValue === 4) {
        const validRange = numberWithinRange(text, 3, menus);
        if (validRange === 'valid') {
            const countyId = parseInt(text.split('*')[3], 10);
            const menuPrompt = await promptToGive(client, 'subcounty', menus, countyId,);
            message = menuPrompt;
        } else {
            message = `${
                end()
            } ${
                menus.outOfRange
            }`;
        }
    } else if (textValue === 5) {
        const validRange = numberWithinRange(text, 4, menus);
        if (validRange === 'valid') {
            const subcountyId = parseInt(text.split('*')[4], 10);
            const menuPrompt = await promptToGive(client, 'location', menus, subcountyId,);
            message = menuPrompt;
        } else {
            message = `${
                end()
            }${
                menus.outOfRange
            }`;
        }
    } else if (textValue === 6) {
        const validRange = numberWithinRange(text, 5, menus);
        if (validRange === 'valid') {
            const locationId = parseInt(text.split('*')[5], 10);
            const menuPrompt = await promptToGive(client, 'area', menus, locationId);
            message = menuPrompt;
        } else {
            message = `${
                end()
            } ${
                menus.outOfRange
            }`;
        }
    } else {
        client.set('userArea', text.split('*')[6]);

        const postLocationDetails = await retreiveCachedItems(client, ['userSubCountySelection', 'userLocationSelection', 'userArea', 'user_id',]);
        const postDetails = {
            sub_county_id: postLocationDetails[0],
            location_id: postLocationDetails[1],
            area: postLocationDetails[2]
        };
        const userId = parseInt(postLocationDetails[3], 10);
        const response = await addLocation(postDetails, userId);


        if (response.status === 200) {
            const menuPrompt = `${
                end()
            } ${
                menus.locationUpdateOk
            }`;
            message = menuPrompt;
        } else {
            message = `${
                end()
            } ${
                menus.locationUpdateFailed
            },`;
        }
    } message += menus.footer;
    return message;
};

/**
 * This function is used to render the menu for adding farm details.
 */
export const renderAddFarmDetailsMenu = async (textValue, text, menus) => {
    let message;
    const userID = await retreiveCachedItems(client, ['user_id']);
    const locationDetailsPresent = await isLocationPresent(userID[0]);

    if (locationDetailsPresent === true) {
        if (textValue === 2) {
            message = renderLocationOptions(menus);
        } else if (textValue === 3 && text.split('*')[2] === '1') {
            let menuPrompt = `${
                con()
            } ${
                menus.enterFarmName
            }`;
            menuPrompt += menus.footer;
            message = menuPrompt;
        } else if (textValue === 4 && text.split('*')[2] === '1') {
            if (isTextOnly(text.split('*')[3]) === true) {
                let menuPrompt = `${
                    con()
                } ${
                    menus.farmArea
                }`;
                menuPrompt += menus.footer;
                message = menuPrompt;

                client.set('farm_name', text.split('*')[3]);
            } else {
                message = `${
                    con()
                } ${
                    menus.invalidInput
                }`;
            }
        } else if (textValue === 5 && text.split('*')[2] === '1') {
            client.set('farm_location', text.split('*')[4]);
            const list = await getFarmSizeMetrics(menus);
            message = list.message;
            message += menus.footer;
        } else if (textValue === 6 && text.split('*')[2] === '1') {
            const selection = text.split('*')[5];
            const list = await getFarmSizeMetrics(menus);
            const unitToUse = list.metricsObject[`${selection}`];
            client.set('metric_unit', unitToUse);
            message = `${
                con()
            } ${
                menus.farmSize
            }`;
        } else if (textValue === 7 && text.split('*')[2] === '1') {
            client.set('farm_size', parseInt(text.split('*')[5], 10));
            const farmDetails = await retreiveCachedItems(client, [
                'farm_name',
                'farm_location',
                'farm_description',
                'farm_size',
                'user_id',
                'metric_unit',
            ]);
            const postDetails = {
                farm_name: farmDetails[0],
                farm_location: farmDetails[1],
                farm_description: 'Null',
                farm_size: farmDetails[3],
                user_id: farmDetails[4],
                metric_units: farmDetails[5]
            };
            const responseForAddingFarm = await addFarm(postDetails);

            if (responseForAddingFarm.status === 200) {
                const menuPrompt = `${
                    end()
                } ${
                    menus.registerFarmSuccess
                }`;
                message = menuPrompt;
                client.set('farm_id', responseForAddingFarm.data.farm_id);
            } else {
                const menuPrompt = `${
                    end()
                } ${
                    menus.registerFarmFail
                }`;
                message = menuPrompt;
            }
        }
        if (text.split('*')[2] === '2') {
            message = await inputFarmLocation(textValue, text, client, menus);
        }
    } else {
        message = `${
            con()
        } ${
            menus.noLocation
        }`;
    }

    return message;
};

/**
 * This function is used to update the user's details.(KYC)
 * The above code is a function that takes in a text value and text and returns a message.
 */
export const renderFarmerUpdateDetailsMenu = async (textValue, text, menus) => {
    let message;
    if (textValue === 2) {
        const farmerMetrics = await getFarmerMetricSections();
        message = responsePrompt(farmerMetrics, 'sections', menus);
    } else if (textValue === 3) {
        const sectionId = parseInt(text.split('*')[2], 10);
        client.set('sectionId', sectionId);
        const questions = await getQuestionsPerSection(sectionId);
        message = responsePrompt(questions, 'questions', menus);
    } else if (textValue === 4) {
        const questionId = parseInt(text.split('*')[3], 10);
        client.set('questionId', questionId);
        const answersPerQuestion = await getAnswersPerQuestion(questionId);

        if (answersPerQuestion.status === 200) {
            let menuPrompt = '';

            answersPerQuestion.data.message[0].kyc_metrics_possible_answers.forEach((answer) => {
                menuPrompt += `\n${
                    answer.id
                }. ${
                    answer.possible_answer
                }`;
                questionanswers[answer.id] = answer.possible_answer;
                questionanswers.question_id = answer.question_id;
            },);
            message = `${
                con()
            } ${
                menus.selectAResponse
            }`;
            message += menuPrompt;
            message += '\n#. Other';
            message += menus.footer;
        } else {
            message = `${
                end()
            } ${
                menus.answerNotAvailable
            }`;
        }
    } else if (textValue === 5) {
        const userAnswers = text.split('*')[4];
        if (userAnswers === '0') {
            message = `${
                con()
            } ${
                menus.typeAnswer
            }`;
            // res.send(message);
        } else {
            const userAnswersArray = userAnswers.split(' ');

            let answers = '';
            userAnswersArray.forEach((answer) => {
                const answerId = parseInt(answer, 10);
                answers += `${
                    questionanswers[`${answerId}`]
                } `;
            });
            client.set('answers', answers);

            message = `${
                con()
            } ${
                menus.proceed
            }`;
        }
    } else if (textValue === 6) {
        if (text.split('*')[3] === '0') {
            setToCache(text, 4, client, 'answers');
        }

        const results = await retreiveCachedItems(client, ['user_id', 'answers', 'questionId',]);

        const kycInfo = {
            metric_id: results[2],
            answer: results[1]
        };
        const updateKYC = await addFarmerKYC(kycInfo, results[0]);
        if (updateKYC.status === 200) {
            message = `${
                end()
            } ${
                menus.kycSuccess
            }`;
        } else {
            message = `${
                end()
            } ${
                menus.kycFailure
            }`;
        }
    }
    return message;
};

/**
 * This function is used to render the menu for adding a product to a farm
 * We have a function that takes in a text value and a text value and returns a message.
 */
export const renderFarmerAddProductMenu = async (textValue, text, menus) => {
    let message = '';
    const farmIDs = [];
    const items = await retreiveCachedItems(client, ['user_id']);
    const userID = parseInt(items[0], 10);
    const hasFarms = await getUserFarms(userID);

    if (hasFarms.status === 404) {
        message = `${
            con()
        } ${
            menus.noFarm
        }`;
    } else if (hasFarms.status === 200) {
        let farmList = '';
        hasFarms.data.message.forEach((farm, index) => {
            farmIDs.push(farm.id);
            farmList += `\n${
                (index += 1)
            }. ${
                farm.farm_name
            }`;
        });
        message = `${
            con()
        } ${
            menus.chooseFarm
        }  ${farmList}`;
        if (textValue === 3) {
            const farmID = farmIDs[parseInt(text.split('*')[2], 10) - 1];

            client.set('farm_id', farmID);
            const menuPrompt = `${
                con()
            } ${
                menus.category
            }${
                await fetchCategories()
            }`;
            message = menuPrompt;
        } else if (textValue === 4) {
            const categoryId = parseInt(text.split('*')[3], 10);
            client.set('category_id', categoryId);
            const products = await fetchProducts(categoryId, []);
            const menuPrompt = `${
                con()
            } ${
                menus.productToAdd
            } \n ${
                products.results
            }`;
            client.set('product_ids', JSON.stringify(products.idsArray));
            message = menuPrompt;
        } else if (textValue === 5) {
            let productIDS = await retreiveCachedItems(client, ['product_ids']);
            productIDS = JSON.parse(productIDS[0]);
            const productId = productIDS[parseInt(text.split('*')[4], 10) - 1];
            client.set('product_id', productId);
            const list = await getProductQuantityMetrics(menus);
            message = list.message;
        } else if (textValue === 6) {
            const list = await getProductQuantityMetrics(menus);
            const selection = text.split('*')[5];
            const produceMetric = list.metricsObject[`${selection}`];
            client.set('produce_metric', produceMetric);
            message = `${
                con()
            } ${
                menus.askForQuantityPerHarvest
            }`;
        } else if (textValue === 7) {
            const availableQuantity = text.split('*')[6];
            
            const productData = await retreiveCachedItems(client, ['farm_id', 'product_id', 'produce_metric',]);
            const postProductDetails = {
                farm_id: productData[0],
                product_id: productData[1],
                capacity: availableQuantity,
                metric_units: productData[2]
            };
            const addingProduct = await addProduct(postProductDetails);

            if (addingProduct.status === 200) {
                message = `${
                    end()
                } ${
                    menus.productAddedSuccessfully
                }`;
            } else {
                message = `${
                    end()
                } ${
                    menus.productAddedFailure
                }`;
            }
        }
    }
    message += menus.footer;
    return message;
};

/**
 * This function renders the update listed produce menu.
 * @param userID - the user's ID
 * @returns None
 */
export const renderUpdateListedProduceMenu = async (textvalue, text, menus) => {
    let userID = await retreiveCachedItems(client, ['user_id']);
    userID = parseInt(userID, 10);
    const hasFarms = await getUserFarms(userID);
    const userFarms = [];
    let message = '';
    if (hasFarms.status === 404) {
        message = `${
            con()
        } ${
            menus.noFarm
        }`;
    } else if (hasFarms.status === 200) {
        let farmList = '';
        hasFarms.data.message.forEach((farm, index) => {
            userFarms.push(farm.id);
            farmList += `\n${
                (index += 1)
            }. ${
                farm.farm_name
            }`;
        });
        message = `${
            con()
        } ${
            menus.chooseFarmToUpdateProduce
        } ${farmList}`;
    }
    const farmID = userFarms[parseInt(text.split('*')[2], 10) - 1];

    if (textvalue === 3 && userFarms.includes(farmID)) {
        message = `${
            con()
        } ${
            menus.actionToTake
        } ${
            menus.updateQuantity
        } ${
            menus.listForSale
        }`;
    } else if (textvalue === 4 && text.split('*')[3] === '1') {
        const products = await showProductsInFarm(farmID, menus, []);
        message = `${
            con()
        } ${
            menus.chooseProduceToUpdateQuantity
        } ${
            products.productList
        }`;
        client.set('update_product_id', products.idsArray[0]);
    } else if (textvalue === 4 && text.split('*')[3] === '2') {
        const products = await showProductsInFarm(farmID, menus, []);
        client.set('sale_product_id', products.idsArray[0]);
        message = `${
            con()
        } ${
            menus.itemToSell
        }  ${
            products.productList
        }`;
    } else if (textvalue === 5 && text.split('*')[3] === '1') {
        message = `${
            con()
        } ${
            menus.itemQuantity
        }`;
    } else if (textvalue === 5 && text.split('*')[3] === '2') {
        message = `${
            con()
        } ${
            menus.bagsForSale
        }`;
    } else if (textvalue === 6 && text.split('*')[3] === '1') {
        const updatedQuantity = text.split('*')[5];
        let productID = await retreiveCachedItems(client, ['update_product_id', 'sale_product_id',]);
        const selectedMetric = await retreiveCachedItems(client, ['produce_metric']);
        productID = parseInt(productID.filter((item) => item !== null)[0], 10);

        let retreivedIDs = await retreiveCachedItems(client, ['productIDs']);
        retreivedIDs = JSON.parse(retreivedIDs[0]);
        const productIdentity = retreivedIDs.find((product) => product.id === productID,);

        const data = {
            farm_id: farmID,
            product_id: productIdentity.prodID,
            capacity: updatedQuantity,
            metric_units: selectedMetric[0]
        };

        const updatedProduce = await updateListedProduct(productID, data);

        if (updatedProduce.status === 200) {
            message = `${
                end()
            } ${
                menus.successfullUpdate
            }`;
        } else {
            message = `${
                end()
            }${
                menus.updateFailed
            }`;
        }
    } else if (textvalue === 6 && text.split('*')[3] === '2') {
        let productID = await retreiveCachedItems(client, ['update_product_id', 'sale_product_id',]);
        productID = parseInt(productID.filter((item) => item !== null)[0], 10);
        const farmProductID = productID;
        const quantity = text.split('*')[4];
        const selectedMetric = await retreiveCachedItems(client, ['produce_metric']);
        const data = {
            farm_product_id: farmProductID,
            units: quantity,
            grade: '3',
            metric_units: selectedMetric[0]
        };
        const response = await listProductForSale(data);


        if (response.status === 200) {
            message = `${
                end()
            } ${
                menus.forSaleSuccess
            }`;
        } else {
            message = `${
                end()
            } ${
                menus.forSaleFailure
            }`;
        }
    }

    return message;
};

export const secondLevelMenu = async (textValue, text, menus) => {
    let message;
    const selection = text.split('*')[2];
    if (textValue === 2) {
        message = renderFarmerMenusLevelTwo(menus);
    }
    if (selection === '6') {
        if (textValue === 3) {
            const userID = await retreiveCachedItems(client, ['user_id']);
            message = await showGroups(userID[0], menus);
        } else if (textValue === 3) {
            const selectedGroup = parseInt(text.split('*')[2], 10);
            const userID = await retreiveCachedItems(client, ['user_id']);
            message = await joinGroup(selectedGroup, userID[0]);
        }
    } else if (selection === '7') {
        const userID = await retreiveCachedItems(client, ['user_id']);
        const farms = await renderFarmerFarms(userID[0], menus, []);
        if (textValue === 3) {
            message = farms.message;
        } else if (textValue === 4) {
            const farmID = farms.idsArray[parseInt(text.split('*')[3], 10) - 1];
            message = await renderProductsInFarm(farmID, menus);
        } else {
            message = `${
                end()
            } ${
                menus.nothingToSee
            }`;
        }
    } else if (selection === '8') {
        const response = await changeUserLocation(textValue, text, client, menus);

        message = response;
    }
    message += menus.footer;
    return message;
};
