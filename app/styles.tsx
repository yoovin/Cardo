import { StyleSheet, Dimensions } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize"

/*
    1. display
    2. list-style
    3. position
    4. float
    5. clear
    6. width / height
    7. padding / margin
    8. border / background
    9. color / font
    10. text-decoration
    11. text-align / vertical-align
    12. white-space
    13. other text
    14. content
*/

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({

    topbar: {
        // flex: 1,
        flexDirection: 'row',
        top: '12%',
        width: '100%', 
        height: '5%', 
        justifyContent:'space-between', 
        alignItems:'center', 
        paddingHorizontal: '5%',
        // backgroundColor: 'gray',
        zIndex: 500
    },

    /*
    ===== Home =====
    */

    dialog: {
        fontSize: RFPercentage(1),
        backgroundColor:'white'
    },

    /*
    ===== TodoCard =====
    */
    
    todoCard: {
        flex: 1,
        backgroundColor: 'white',
    },

    iconCover: {
        width: width * 0.15, 
        height: height * 0.07, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: width * 0.17,
        backgroundColor: 'white',
        zIndex: 101,
    },

    progressText: {
        marginHorizontal: 10,
        color: '#575757'
    },

    dateText: {
        marginVertical: '3%',
        color: '#696868'
    },

    menuModal: {
        width, 
        height: '25%',
        // backgroundColor: 'pink', 
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },

    /*
    ===== TodoContent=====
    */

    completed: {
        textDecorationLine: 'line-through',
        color: '#c1c1c1'
    },

    /*
    ===== ChangeOOView =====
    */

    changeView: {
        position:'absolute', 
        left: '10%',
        width: '80%', 
        height: '80%', 
        borderRadius: 10, 
        backgroundColor: 'white', 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 100,
    },

    colorCover: {
        width: width * 0.15, 
        height: height * 0.07, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: width * 0.17,
    },

    /*
    ===== AddTask =====
    */

    taskInput: {
        width: '80%', 
        height: '8%',
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: '#adadad',
        fontSize: RFPercentage(2.5),
    },

    subMenu: {
        width: '80%',
        height: '7%',
        // marginVertical: '2%',
        padding: '3%',
        borderBottomWidth: 1,
        borderBottomColor: '#adadad',

        // backgroundColor: 'aqua'
    },

    subMenuButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    /*
    ===== Common =====
    */
    fullScreen: {
        width: width,
        height: height
    },
    
    cancelText: {
        color: '#fa3434'
    },

    confirmText: {
        color: '#3480fa'
    },

    hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea'
    },

    /*
    ===== Font =====
    */
    textXs: {
        fontSize: RFPercentage(1)
    },

    textSm: {
        fontSize: RFPercentage(1.5)
    },

    textBase: {
        fontSize: RFPercentage(2)
    },

    textLg: {
        fontSize: RFPercentage(2.5)
    },

    textXl: {
        fontSize: RFPercentage(3)
    },

    text2xl: {
        fontSize: RFPercentage(4)
    },

    fontBold: {
        fontWeight: 'bold'
    }
})