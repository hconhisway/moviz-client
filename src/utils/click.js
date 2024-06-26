/* eslint-disable */
import { drawBox } from "./drawBox";
import { drawLines, updateLines, updateLinesDashArrow } from "./drawlines";
import { getBoxLayout, getTreeLayout } from "./layout";
import { arraysAreEqual, getHierarchy, findChildrenAtSameLevel, autoTranslate } from "./utilities";
import flextree from "./flextree";
import getMultiTree from "./multitree";
import * as d3 from "d3";

export function handleClick(fnS, body, body_num, sourceid, color, clicked, direction) {
  console.log(direction, "direction");
  const transitionTime1 = 920;
  const transitionTime2 = 720;
  const transitionTime3 = 200;
  const openFlag = d3.select("#boxid" + String(body_num)).select("#" + String(sourceid));
  // console.log(openFlag.attr("data-opened"));
  if (clicked || openFlag.attr("data-opened") === "true") {
    // openFlag.attr("data-opened", "false");
    d3.select("#boxid" + String(body_num)).selectAll("[data-opened='true']").attr("data-opened", "false");
    d3.selectAll('.drawer').each(function(d,i){
      let GID = d3.select(this).attr('id').replace('line', '').replace('boxid', '');
      const deleteLabel = String(body_num) + '-' + String(body);
      const deleteParts = deleteLabel.split('-');
      // delete edges
      if (GID.split('_').length === 2){
        let deleteFlag = false;
        const node1 = GID.split('_')[0];
        const node2 = GID.split('_')[1];
        const node1Parts = node1.split('-');
        const node2Parts = node2.split('-');
        if (arraysAreEqual(node1Parts, deleteParts)) {
          d3.select(this)
            .transition('transition1')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          deleteFlag = true;
        } else if (node1Parts.length > deleteParts.length) {
          const firstNParts = node1Parts.slice(0, deleteParts.length);
          if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
            d3.select(this)
            .transition('transition2')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
            deleteFlag = true;
          }
        }
        if (!deleteFlag) {
          if (arraysAreEqual(node2Parts, deleteParts)) {
            d3.select(this)
            .transition('transition3')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          } else if (node2Parts.length > deleteParts.length) {
            const firstNParts = node2Parts.slice(0, deleteParts.length);
            if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
              d3.select(this)
            .transition('transition4')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
            }
          }
        }
      } else { // delete nodes
        const GIDParts = GID.split('-');
        if (arraysAreEqual(GIDParts, deleteParts)) {
          d3.select(this)
            .transition('transition5')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
        } else if (GIDParts.length > deleteParts.length) {
          const firstNParts = GIDParts.slice(0, deleteParts.length);
          if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
            d3.select(this)
            .transition('transition6')        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          }
        }
      }
      // console.log(GID);
    })
    return;
  }
  body_num = String(body_num);
  const layout = getBoxLayout(fnS[body-1]);
  const spaceX = 80;
  const spaceY = 0;
  const padding = 90;
  const newLabel = String(body_num) + '-' + String(body); // new body_num
  
  // add parent info for moving
  const parentNode = d3.select("#boxid" + body_num).select("#" + sourceid);
  const parentFrame = d3.select("#boxid" + body_num).select("#frame" + body_num);
  const parentNodeCoord = [Number(parentNode.attr("x")) + Number(parentNode.attr('width')) / 2, Number(parentNode.attr("y")) + Number(parentNode.attr('height')) / 2];
  const parentFrameCoord = [Number(parentFrame.attr("x")) + Number(parentFrame.attr('width')) / 2, Number(parentFrame.attr("y")) + Number(parentFrame.attr('height')) / 2];
  // console.log(parentNode, parentFrame)
  // console.log(parentNodeCoord, parentFrameCoord);
  const parentCoord = [parentNodeCoord[0] - parentFrameCoord[0], parentNodeCoord[1] - parentFrameCoord[1]];
  drawBox(layout, fnS, newLabel, direction, parentCoord);
  var hierarchies = getHierarchy(spaceY);
  var treeLayout = {};
  treeLayout = getMultiTree(hierarchies);
  // console.log(hierarchies, "hierarchies");
  // const flexLayout = flextree({ spacing: spaceX });
  // const tree = flexLayout.hierarchy(hierarchies);
  // var treeData = flexLayout(tree);
  // treeData.each(d => {
  //   const x = d.x;
  //   d.x = d.y;
  //   d.y = x;
  // });
  // var treeLayout = {};
  // treeData.each(d => {
  //   treeLayout[d.data.oName] = [d.x, d.y, d.data.size[1], d.data.size[0] * 1];
  // });
  const nodeNames = Object.keys(treeLayout);
  let differenceX = treeLayout[newLabel][0] - treeLayout[body_num][0];
  let differenceY = treeLayout[newLabel][1] - (treeLayout[body_num][1]);
  
  const locationTransform = [differenceX, differenceY];
  drawLines(sourceid, "frame" + newLabel, locationTransform, body_num, newLabel, color, direction);
  // console.log(locationTransform);
  d3.selectAll('.drawer').each(function(d, i){
    let nodeID = d3.select(this).attr('id').replace("boxid", "");
    if (nodeID.split('_').length !==2) {
      if (nodeID === newLabel) {
        d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5})`)
          .attr("opacity", 0);
        d3.select(this)
          .transition('transition7')
          .duration(transitionTime1)
          .style("opacity", 1);
      } else {
        d3.select(this)
          .transition('transition8')
          .duration(transitionTime2)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5})`);
      }
    }
  })
  d3.selectAll('.drawer').each(function(d, i){
    let nodeID = d3.select(this).attr('id').replace("boxid", "");
    if (nodeID.split('_').length === 2){
      if (d3.select(this).attr("line-type") !== "dashed") {
        const lineID = nodeID;
        const sourceGID = nodeID.replace("line", "").split('_')[0];
        const targetGID = nodeID.replace("line", "").split('_')[1];
        const sourceTransString = d3.select("#boxid" + sourceGID).attr('transform');
        const targetTransString = d3.select("#boxid" + targetGID).attr('transform');
        if (sourceTransString!==null && sourceGID != newLabel){
          const translatePart = sourceTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5];
          const locationTransformForThis = [treeLayout[targetGID][0] - treeLayout[sourceGID][0], treeLayout[targetGID][1] - (treeLayout[sourceGID][1])];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const a01 = d3.select(this).attr('sourceid');
            const a02 = d3.select(this).attr('targetid');
            const a04 = d3.select(this).attr('body_num_source');
            const a05 = d3.select(this).attr('body_num_target');
            const a06 = d3.select(this).attr('color');
            const currentDirection = d3.select("#boxid" + a05).attr("direction");
            updateLines(a01, a02, locationTransformForThis, a04, a05, a06, lineID, currentDirection);
          }
        }
        if (targetTransString!==null && targetGID != newLabel){
          const translatePart = targetTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          const locationTransformForThis = [treeLayout[targetGID][0] - treeLayout[sourceGID][0], treeLayout[targetGID][1] - (treeLayout[sourceGID][1])];
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5 ];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const a01 = d3.select(this).attr('sourceid');
            const a02 = d3.select(this).attr('targetid');
            const a04 = d3.select(this).attr('body_num_source');
            const a05 = d3.select(this).attr('body_num_target');
            const a06 = d3.select(this).attr('color');
            const currentDirection = d3.select("#boxid" + a05).attr("direction");
            updateLines(a01, a02, locationTransformForThis, a04, a05, a06, lineID, currentDirection);
          }
        }
        
        nodeID = nodeID.replace("line", "");
        nodeID = nodeID.split('_')[0];
        d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 })`)
          .style("opacity", 0.38);
      } else {
        const lineID = nodeID;
        const sourceGID = nodeID.replace("line", "").split('_')[0];
        const targetGID = nodeID.replace("line", "").split('_')[1];
        const sourceTransString = d3.select("#boxid" + sourceGID).attr('transform');
        const targetTransString = d3.select("#boxid" + targetGID).attr('transform');
        if (sourceTransString!==null && sourceGID != newLabel) {
          const translatePart = sourceTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const line_label = d3.select(this).select('text').text();
            updateLinesDashArrow(treeLayout, sourceGID, targetGID, "black", line_label, lineID);
          }
        }
        if (targetTransString!==null && targetGID != newLabel){
          const translatePart = targetTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const line_label = d3.select(this).select('text').text();
            updateLinesDashArrow(treeLayout, sourceGID, targetGID, "black", line_label, lineID);
          }
        }
        nodeID = nodeID.replace("line", "");
        nodeID = nodeID.split('_')[0];
        d3.select(this)
          .transition('transition9')
          .duration(720)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5})`);
      }
    }
  })
}