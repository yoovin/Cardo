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
        flex: 1,
        flexDirection: 'row', 
        // width: '100%', 
        // height: '10%', 
        justifyContent:'space-between', 
        alignItems:'center', 
        paddingHorizontal: '5%',
        zIndex: 999
    },

    /*
    ===== TodoCard =====
    */
    
    todoCard: {
        flex: 1,
        backgroundColor: 'white'
    },

    iconCover: {
        width: width * 0.15, 
        height: height * 0.07, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: width * 0.17,
    },

    progressText: {
        marginHorizontal: 10,
        color: '#575757'
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