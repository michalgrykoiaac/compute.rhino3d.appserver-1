# SKYGLAZER
A node.js server for solving Grasshopper definitions on Rhino Compute



![skyglazer screenshot](https://user-images.githubusercontent.com/97453175/177808658-6db38352-cf09-4f01-a5c2-f46c8cf63c73.png)



ABOUT

An online web configurator for designing and panalizing glass roofs.

STEPS

#1 FORM CREATION- move points on screen to create the path of the roof and adjust radius of the arcs that will make the form.
RH_IN:points - point
RH_IN:arcRadius1 - number
RH_IN:arcRadius2 - number
RH_IN:arcRadius3 - number
RH_IN:arcRadius4 - number

#2 PANELIZATION- turn on the wireframe to configure the type of panels.  Choose between quad, triangular and diamond shaped panels and adjust the U and V divisions to desire amount.
RH_IN:showWireframe - boolean
RH_IN:panelType - number
RH_IN:uDivisions - number
RH_IN:vDivisions - number

#3 COLOURING - turn on the colour and select the colour pattern.  Choose between a heat map gradient, rainbow gradient and red gradient.
RH_IN:showColour - boolean
RH_IN:panelColour - number

#4 GROUPING- Choose how the panels are grouped and by what amount.  Choose between grouping by curvature, x-axis alignment or a scattered pattern.  The number of groups can be adjusted and the group numbers can be turned on as a guide.
RH_IN:showGroupNumbers - boolean
RH_IN:panelGroupingType - number
RH_IN:panelTypeNumber - number

#5 DATA OUTPUT- view panelization data created from your customization

Surface Area
centralPathLength
panelType
colourGradient
panelNumber
panelTypeNumber

#6 LAYERS- turn on and off additional layers before setting your final persepctive view
Arcs
Boundary
Path
Terrain
People
Trees
Control points

#7 BUTTONS- move to set views to take a screenshot if desired and download final .3dm file

Plan View
Perspective View
Download

*Lunch box plugin used for panelization
**Extreme forms may cause panelization errors, if so adjust the arcs or starting points to fix
 
