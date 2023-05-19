//
//  SharedStorage.h
//  YVTodo
//
//  Created by Yoovin Shim on 2023/04/27.
//

#if __has_include("RCTBridgeModule.h")
  #import "RCTBridgeModule.h"
#else
  #import <React/RCTBridgeModule.h>
#endif

@interface SharedStorage : NSObject<RCTBridgeModule>

@end
