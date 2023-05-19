//
//  SharedStorage.m
//  YVTodo
//
//  Created by Yoovin Shim on 2023/04/27.
//

#import <Foundation/Foundation.h>
#import "SharedStorage.h"

@implementation SharedStorage

-(dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(SharedStorage);

RCT_EXPORT_METHOD(set:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try{
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.react.native.widget.YVTodo"]; //App Group명
    [shared setObject:data forKey:@"data"]; // data를 저장할 key 값
    [shared synchronize];
    resolve(@"true");
  }@catch(NSException *exception){
    reject(@"get_error",exception.reason, nil);
  }

}

@end

