PROTOTYPING THE ORGANIC

ABOUT

An online web configurator integrating AI form generation to create gridshell and panelized structures.

STEPS

#1 AI FORM CREATION (WIP)- Upload inspirational natural image and text prompt for 3D form generation 
* this is work in progress and a pre-generated AI mesh is uploaded as a case study based on a mountain reference

RH_IN:imageUpload - image
RH_IN:textPromt - text
RH_IN:showAIGeneratedMesh - boolean

#2 GRIDSHELL- activate physics simulation to rationalise AI generated form and propose basic gridshell types.  Can manipulate grid size, rotation angle and whether to show beams.

RH_IN:showGridshellWireframe - boolean
RH_IN:showGridshellThickness - boolean
RH_IN:gridSize - number
RH_IN:gridAngle - number

#3 PANELIZATION- turn on the wireframe to configure the type of panels.  Choose between quad, triangular and diamond shaped panels and adjust the U and V divisions to desire amount.
		   - turn on the colour and select the colour pattern.  Choose between a heat map gradient, rainbow gradient and red gradient.
               - Choose between grouping by curvature, x-axis alignment or a scattered pattern.  The number of groups can be adjusted and the group numbers can be turned on as a guide.

RH_IN:showWireframe - boolean
RH_IN:panelType - number
RH_IN:uDivisions - number
RH_IN:vDivisions - number
RH_IN:showColour - boolean
RH_IN:panelColour - number
RH_IN:showGroupNumbers - boolean
RH_IN:panelGroupingType - number
RH_IN:panelTypeNumber - number

#5 DATA OUTPUT- view panelization data created from your customization for gridshells and panels

Surface Area
MemberNumber
Shortest length
Longest Length

groupingType
panelType
colourGradient
panelNumber
panelTypeNumber

#6 LAYERS- turn on and off additional layers before setting your final persepctive view

Terrain
People
Trees


#7 BUTTONS- move to set views to take a screenshot if desired and download final .3dm file

Plan View
Perspective View
Download

*Lunch box plugin used for panelization and k-means
**Kangaroo plugin used for form optimization
*** pufferfish plugin used for mesh manipulation procedures
 