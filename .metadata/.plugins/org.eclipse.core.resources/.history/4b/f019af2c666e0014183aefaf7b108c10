package com.fxcore2.samples;

import java.util.concurrent.ConcurrentLinkedQueue;

public class EventPipe {

    private final Object mSyncObject = new Object();

    private ConcurrentLinkedQueue<EventType> mEventQueue;

    public EventPipe() {
        mEventQueue = new ConcurrentLinkedQueue<EventType>();
    }

    public EventType waitEvent() {
        if (mEventQueue.size() != 0)
            return mEventQueue.poll();

        synchronized (mSyncObject) {
            try {
                mSyncObject.wait();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

        return mEventQueue.poll();
    }

    public void putEvent(EventType eEventType) {
        mEventQueue.add(eEventType);
        synchronized (mSyncObject) {
            mSyncObject.notify();
        }
    }
}