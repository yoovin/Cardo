import {NativeModules} from 'react-native'

const NativeSharedDefaults = NativeModules.SharedDefaults

const SharedStorage = async (obj: Record<string, any>) => {
    try {
        //UserDefaults는 NSString을 받기 때문에 JSON.stringify()하여 Write
        const res: boolean = await NativeSharedDefaults.set(JSON.stringify(obj));
        return res;
    } catch (e) {
        console.warn('[SHARED DEFAULTS]', e);
        return false;
    }
}

export default SharedStorage