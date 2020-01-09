# FACE RECOGNITION APP

simple face recognition app using react in the front end and face-api.js to perform the recognition.
face-api.js is an api to perform face detection and recognition built on tensorflow.js core.

# HOW DOES THE APPLICATION WORK?

application starts with a landing page that simply reads "WELCOME". To the top left in the navigation bar, there are are buttons to navigate to home(landing page), static face detection, recognition, and new input.

**static face detection:**
Here you can upload a picture from the local storage to identify known faces and detect all the faces. A default picture has been provided.

**recognition**
Live webcam that detects faces and recognizes known faces.

**new input**
Adding new faces by clicking through live webcam. After adding your pictures here, the recognizer can recognize you.

# face recognition

For face recognition, the face-api.js uses a ResNet-34 like architecture, implemented to compute a face descriptor (a feature vector with 128 values) from any given face image, which is used to describe the characteristics of a persons face. One can determine the similarity of two arbitrary faces by comparing their face descriptors, for example by computing the euclidean distance or using any other classifier of your choice.

# storage of input images

A full face description gives a face descriptor of particular face which is actually a feature vector of 128 values. We are storing the descriptors alonf with the identifier of the person in a JSON file. We don't store sample photos in the app to save processing time and optimize application size.

# Aspects for future optimization.

This can be improvised into a full fledged authentication application by using the _recognition_ as _login_ and _new input_ as _signup_.

A proper database can be connected to store the descriptors of a large number of people. At present it is not efficient enough to store descriptors of more than 100 person.

The input of images can be made system guided.
