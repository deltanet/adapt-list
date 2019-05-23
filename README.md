# adapt-list

**List** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

The component displays a vertically stacked list of items.

## Installation

**List** must be manually installed in the adapt framework and authoring tool.

If **List** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  

## Settings Overview

The attributes listed below are used in *components.json* to configure **List**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-list/blob/master/example.json).  

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `list`.

**_classes** (string): CSS class name to be applied to **List**’s containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space. A predefined CSS class can be applied to an Accordion Item.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**_animateList** (boolean): Setting this value to `true` will cause the items to animate onto the screen. The default is `true`.   

**_showBackground** (boolean): Setting this value to `true` will set a background colour on the items. The default is `false`.   

**_items** (array): Multiple items may be created. Each _item_ represents one element of the list and contains values for **title**, **titleReduced**, **_imageSrc**, **alt**, and **_delay**.  

>**title** (string): This text is displayed as the item's text.

>**titleReduced** (string): This text is displayed as the item's reduced text.

>**_imageSrc** (string): File name (including path) of the image. Path should be relative to the *src* folder.  

>**alt** (string): This text becomes the image’s `alt` attribute.  

>**_delay** (number): Defines the number of seconds before the item is animated on screen. The default is `0.5`.   

### Accessibility

**List** has been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. This label is not a visible element. It is utilized by assistive technology such as screen readers. Should the region's text need to be customised, it can be found within the **globals** object in [*properties.schema*](https://github.com/deltanet/adapt-list/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

No known limitations.  

----------------------------
**Version number:**  1.2.0  
**Framework versions:** 2.0  
**Author / maintainer:** Kineo / DeltaNet (Forked from Kineo)  
**RTL support:** yes  
**Authoring tool support:** yes
